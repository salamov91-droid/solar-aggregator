import { promises as fs } from 'fs';
import path from 'path';
import type { SolarSolution } from '@/types/solution';
import { fallbackSolutions } from '@/lib/data/fallback-solutions';
import { scrapeVoltaSolutions } from '@/lib/parsers/volta';
import { scrapeESolarSolutions } from '@/lib/parsers/eSolar';

const cachePath = path.join(process.cwd(), 'public', 'solutions-cache.json');

export async function getSolutions(): Promise<SolarSolution[]> {
  const liveMode = isLiveCatalogMode();

  if (liveMode) {
    const live = await fetchLiveSolutions();
    if (live.length) {
      return live;
    }
  }

  const cached = await readCache();
  if (cached.length) {
    return cached;
  }

  return fallbackSolutions;
}

export async function refreshSolutions(): Promise<SolarSolution[]> {
  const result = await fetchLiveSolutions();
  const finalResult = result.length ? result : fallbackSolutions;

  if (shouldPersistCache()) {
    await ensurePublicDir();
    await fs.writeFile(cachePath, JSON.stringify(finalResult, null, 2), 'utf-8');
  }

  return finalResult;
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

async function readCache(): Promise<SolarSolution[]> {
  try {
    const raw = await fs.readFile(cachePath, 'utf-8');
    const parsed = JSON.parse(raw) as SolarSolution[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function ensurePublicDir() {
  await fs.mkdir(path.dirname(cachePath), { recursive: true });
}

function isLiveCatalogMode(): boolean {
  return process.env.LIVE_CATALOG_MODE === 'true' || process.env.VERCEL === '1';
}

function shouldPersistCache(): boolean {
  return process.env.VERCEL !== '1';
}
