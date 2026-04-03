import type { SolarSolution, SolutionScenario, SolutionSegment, SolutionType } from '@/types/solution';
import { fetchHtml, load, normalizeWhitespace, parsePrice, slugify } from './shared';

const voltaCategories: Array<{ type: SolutionType; url: string }> = [
  { type: 'Сетевые', url: 'https://www.voltaen.com/catalog/setevye-solnechnye-stantsii/' },
  { type: 'Гибридные', url: 'https://www.voltaen.com/catalog/gibridnye-solnechnye-stantsii/' },
  { type: 'Автономные', url: 'https://www.voltaen.com/catalog/avtonomnye-solnechnye-stantsii/' },
];

function extractPower(title: string): string | null {
  const match = title.match(/(\d+[\.,]?\d*)\s*квт/i);
  return match ? `${match[1].replace('.', ',')} кВт` : null;
}

function extractBattery(title: string): string | null {
  const match = title.match(/(\d+[\.,]?\d*)\s*квт\.?ч/i);
  return match ? `${match[1].replace('.', ',')} кВт·ч` : null;
}

function inferSegment(title: string, categoryUrl: string): SolutionSegment {
  const value = `${title} ${categoryUrl}`.toLowerCase();
  if (value.includes('дом') || value.includes('дач')) return 'Для дома';
  return 'Для бизнеса';
}

function inferScenario(type: SolutionType): SolutionScenario {
  if (type === 'Гибридные') return 'Экономия + резерв';
  if (type === 'Автономные') return 'Автономия';
  return 'Экономия';
}

function resolveUrl(href: string | undefined, fallback: string): string {
  if (!href) return fallback;
  if (href.startsWith('http')) return href;
  return `https://www.voltaen.com${href}`;
}

export async function scrapeVoltaSolutions(): Promise<SolarSolution[]> {
  const results: SolarSolution[] = [];

  for (const category of voltaCategories) {
    const html = await fetchHtml(category.url);
    const $ = load(html);

    const cards = $('.catalog-item-card, .product-item, .products-list__item, .catalog-section-list > *');
    if (!cards.length) {
      console.warn(`[scraper][volta] No cards found for ${category.url}`);
      continue;
    }

    cards.each((_, node) => {
      const title = normalizeWhitespace($(node).find('.catalog-item-title, .catalog-item-card__title, .item-title, h3, h4').first().text());
      const linkNode = $(node).find('a[href]').first();
      const href = linkNode.attr('href');
      const sourceUrl = resolveUrl(href, category.url);
      const priceRaw = normalizeWhitespace($(node).find('.price, .catalog-item-price, .price-current, [class*=price]').first().text());
      const imageRaw = $(node).find('img').first().attr('src') ?? $(node).find('img').first().attr('data-src') ?? null;
      const imageUrl = imageRaw ? resolveUrl(imageRaw, category.url) : null;

      if (!title) return;

      results.push({
        id: `volta-${slugify(sourceUrl.replace('https://www.voltaen.com', ''))}`,
        partner: 'Volta Energy',
        type: category.type,
        scenario: inferScenario(category.type),
        segment: inferSegment(title, category.url),
        title,
        power: extractPower(title),
        generationPerDay: null,
        battery: extractBattery(title),
        basePrice: parsePrice(priceRaw),
        sourceUrl,
        imageUrl,
        categoryUrl: category.url,
        lastUpdated: new Date().toISOString(),
      });
    });
  }

  return dedupe(results);
}

function dedupe(items: SolarSolution[]): SolarSolution[] {
  const seen = new Map<string, SolarSolution>();
  for (const item of items) {
    if (!seen.has(item.sourceUrl)) {
      seen.set(item.sourceUrl, item);
    }
  }
  return [...seen.values()];
}
