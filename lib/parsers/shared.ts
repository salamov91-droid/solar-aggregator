import * as cheerio from 'cheerio';

export async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; SolarAggregatorBot/1.0)',
      Accept: 'text/html,application/xhtml+xml',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
}

export function normalizeWhitespace(value: string | null | undefined): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

export function parsePrice(raw: string): number | null {
  const digits = raw.replace(/[^\d]/g, '');
  if (!digits) {
    return null;
  }
  return Number(digits);
}

export function slugify(value: string): string {
  return normalizeWhitespace(value)
    .toLowerCase()
    .replace(/[^a-zа-я0-9]+/gi, '-')
    .replace(/(^-|-$)/g, '');
}

export function load(html: string) {
  return cheerio.load(html);
}
