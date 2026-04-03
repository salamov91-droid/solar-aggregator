import type { SolarSolution, SolutionType } from '@/types/solution';
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

export async function scrapeVoltaSolutions(): Promise<SolarSolution[]> {
  const results: SolarSolution[] = [];

  for (const category of voltaCategories) {
    const html = await fetchHtml(category.url);
    const $ = load(html);

    const cards = $('.catalog-section-list .catalog-item-card, .products-list .catalog-item-card, .catalog-list .catalog-item-card');
    if (!cards.length) {
      continue;
    }

    cards.each((_, node) => {
      const title = normalizeWhitespace($(node).find('.catalog-item-title, .catalog-item-card__title, .item-title').first().text());
      const href = $(node).find('a').first().attr('href') ?? category.url;
      const priceRaw = normalizeWhitespace($(node).find('.price, .catalog-item-price, .price-current').first().text());
      if (!title) return;

      const sourceUrl = href.startsWith('http') ? href : `https://www.voltaen.com${href}`;
      const basePrice = parsePrice(priceRaw);

      results.push({
        id: `volta-${slugify(title)}`,
        partner: 'Volta Energy',
        type: category.type,
        title,
        power: extractPower(title),
        generationPerDay: null,
        battery: extractBattery(title),
        basePrice,
        sourceUrl,
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
    if (!seen.has(item.id)) {
      seen.set(item.id, item);
    }
  }
  return [...seen.values()];
}
