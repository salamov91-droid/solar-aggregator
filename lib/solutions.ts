import { promises as fs } from 'fs';
import path from 'path';
import type { SolarSolution } from '@/types/solution';
import { fallbackSolutions } from '@/lib/data/fallback-solutions';
import { scrapeVoltaSolutions } from '@/lib/parsers/volta';
import { scrapeESolarSolutions } from '@/lib/parsers/eSolar';

const cachePath = path.join(process.cwd(), 'public', 'solutions-cache.json');
const CACHE_TTL_MS = 1000 * 60 * 60 * 6;

export async function getSolutions(): Promise<SolarSolution[]> {
  const liveMode = process.env.LIVE_CATALOG_MODE === 'true';
  const cached = await readCache();
  const hasFreshCache = cached.updatedAt && Date.now() - cached.updatedAt < CACHE_TTL_MS;

  console.info(`[solutions] getSolutions start: liveMode=${liveMode}, cached=${cached.items.length}, cacheFresh=${Boolean(hasFreshCache)}`);

  if (liveMode) {
    const live = await fetchLiveSolutions('getSolutions/liveMode');
    if (live.length) {
      await persistCache(live);
      console.info(`[solutions] getSolutions resolved from live mode with ${live.length} items`);
      return live;
    }

    if (cached.items.length) {
      console.warn(`[solutions] getSolutions live mode failed, using cached ${cached.items.length} items`);
      return cached.items;
    }

    console.warn(`[solutions] getSolutions live mode failed and cache empty, using fallback ${fallbackSolutions.length} items`);
    return fallbackSolutions;
  }

  if (cached.items.length && hasFreshCache) {
    console.info(`[solutions] getSolutions resolved from fresh cache with ${cached.items.length} items`);
    return cached.items;
  }

  const live = await fetchLiveSolutions('getSolutions/cacheExpired');
  if (live.length) {
    await persistCache(live);
    console.info(`[solutions] getSolutions resolved from live (cache refresh) with ${live.length} items`);
    return live;
  }

  if (cached.items.length) {
    console.warn(`[solutions] getSolutions live refresh failed, using stale cache ${cached.items.length} items`);
    return cached.items;
  }

  console.warn(`[solutions] getSolutions no live, no cache; using fallback ${fallbackSolutions.length} items`);
  return fallbackSolutions;
}

export async function refreshSolutions(): Promise<SolarSolution[]> {
  console.info('[solutions] refreshSolutions started');
  const result = await fetchLiveSolutions('refreshSolutions');
  const finalResult = result.length ? result : fallbackSolutions;

  if (!result.length) {
    console.warn(`[solutions] refreshSolutions live fetch failed, persisting fallback ${fallbackSolutions.length} items`);
  }

  await persistCache(finalResult);
  console.info(`[solutions] refreshSolutions completed with ${finalResult.length} items`);

  return finalResult;
}

async function persistCache(items: SolarSolution[]) {
  if (shouldPersistCache()) {
    await ensurePublicDir();
    await fs.writeFile(cachePath, JSON.stringify(items, null, 2), 'utf-8');
    console.info(`[solutions] cache persisted: ${items.length} items -> ${cachePath}`);
    return;
  }

  console.info('[solutions] cache persistence skipped in Vercel runtime');
}

async function fetchLiveSolutions(context: string): Promise<SolarSolution[]> {
  console.info(`[solutions] fetchLiveSolutions(${context}) started`);

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

  const voltaItems = volta.status === 'fulfilled' ? volta.value : [];
  const eSolarItems = eSolar.status === 'fulfilled' ? eSolar.value : [];

  const merged: SolarSolution[] = [...voltaItems, ...eSolarItems];

  console.info(`[solutions] fetchLiveSolutions(${context}) sources: volta=${voltaItems.length}, eSolar=${eSolarItems.length}, merged=${merged.length}`);

  if (!merged.length) {
    console.warn(`[solutions] fetchLiveSolutions(${context}) produced 0 items, fallback path will be used`);
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
