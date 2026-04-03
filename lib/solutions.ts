import { promises as fs } from 'fs';
import path from 'path';
import type { SolarSolution } from '@/types/solution';
import { fallbackSolutions } from '@/lib/data/fallback-solutions';
import { scrapeVoltaSolutions } from '@/lib/parsers/volta';
import { scrapeESolarSolutions } from '@/lib/parsers/eSolar';

const cachePath = path.join(process.cwd(), 'public', 'solutions-cache.json');
const CACHE_TTL_MS = 1000 * 60 * 60 * 6;

export async function getSolutions(): Promise<SolarSolution[]> {
  const cached = await readCache();
  const hasFreshCache = cached.updatedAt && Date.now() - cached.updatedAt < CACHE_TTL_MS;

  if (cached.items.length && hasFreshCache) {
    return cached.items;
  }

  const live = await fetchLiveSolutions();
  if (live.length) {
    await persistCache(live);
    return live;
  }

  if (cached.items.length) {
    return cached.items;
  }

  return fallbackSolutions;
}

export async function refreshSolutions(): Promise<SolarSolution[]> {
  const result = await fetchLiveSolutions();
  const finalResult = result.length ? result : fallbackSolutions;

  await persistCache(finalResult);

  return finalResult;
}

async function persistCache(items: SolarSolution[]) {
  if (shouldPersistCache()) {
    await ensurePublicDir();
    await fs.writeFile(cachePath, JSON.stringify(items, null, 2), 'utf-8');
  }
}

async function fetchLiveSolutions(): Promise<SolarSolution[]> {
  const [volta, eSolar] = await Promise.allSettled([
    scrapeVoltaSolutions(),
    scrapeESolarSolutions(),
  ]);

  if (volta.status === 'rejected') {
    console.error('[scraper] Volta failed:', volta.reason);
  }

  if (eSolar.status === 'rejected') {
    console.error('[scraper] e-solarpower failed:', eSolar.reason);
  }

  const merged: SolarSolution[] = [
    ...(volta.status === 'fulfilled' ? volta.value : []),
    ...(eSolar.status === 'fulfilled' ? eSolar.value : []),
  ];

  if (!merged.length) {
    console.warn('[scraper] No live solutions fetched. Falling back to cache/fallback data.');
  }

  return merged;
}

async function readCache(): Promise<{ items: SolarSolution[]; updatedAt: number | null }> {
  try {
    const [raw, stats] = await Promise.all([
      fs.readFile(cachePath, 'utf-8'),
      fs.stat(cachePath),
    ]);

    const parsed = JSON.parse(raw) as SolarSolution[];

    return {
      items: Array.isArray(parsed) ? parsed : [],
      updatedAt: stats.mtimeMs,
    };
  } catch {
    return { items: [], updatedAt: null };
  }
}

async function ensurePublicDir() {
  await fs.mkdir(path.dirname(cachePath), { recursive: true });
}

function shouldPersistCache(): boolean {
  return process.env.VERCEL !== '1';
}
