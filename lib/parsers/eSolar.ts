import type { SolarSolution, SolutionType } from '@/types/solution';
import { fetchHtml, load, normalizeWhitespace, parsePrice, slugify } from './shared';

const categories: Array<{ type: SolutionType; url: string }> = [
  { type: 'Сетевые', url: 'https://e-solarpower.ru/solar/solnechnye-elektrostancii-dlya-doma-i-dachi/ekonomiya-ru/' },
  { type: 'Сетевые', url: 'https://e-solarpower.ru/solar/solnechnye-elektrostancii-dlya-predpriyatiy/ekonomiya/' },
  { type: 'Гибридные', url: 'https://e-solarpower.ru/solar/solnechnye-elektrostancii-dlya-doma-i-dachi/nezavisimost-i-ekonomiya/' },
  { type: 'Гибридные', url: 'https://e-solarpower.ru/solar/solnechnye-elektrostancii-dlya-predpriyatiy/nezavisimost-ekonomiya/' },
  { type: 'Автономные', url: 'https://e-solarpower.ru/solar/solnechnye-elektrostancii-dlya-doma-i-dachi/nezavisimost-ru/' },
  { type: 'Автономные', url: 'https://e-solarpower.ru/solar/solnechnye-elektrostancii-dlya-predpriyatiy/nezavisimost/' },
];

function extractField(text: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return normalizeWhitespace(match[1]);
    }
  }
  return null;
}

function cleanValue(raw: string | null): string | null {
  const value = normalizeWhitespace(raw);
  return value || null;
}

export async function scrapeESolarSolutions(): Promise<SolarSolution[]> {
  const results: SolarSolution[] = [];

  for (const category of categories) {
    const html = await fetchHtml(category.url);
    const $ = load(html);

    const cards = $('.product-layout, .product-thumb, .product-grid, .product-item');
    cards.each((_, node) => {
      const title = normalizeWhitespace($(node).find('.caption h4, .product-name, h4 a').first().text());
      const href = $(node).find('a').first().attr('href') ?? category.url;
      const priceRaw = normalizeWhitespace($(node).find('.price, .price-new').first().text());
      const meta = normalizeWhitespace($(node).text());
      if (!title) return;

      const sourceUrl = href.startsWith('http') ? href : `https://e-solarpower.ru${href}`;

      results.push({
        id: `esolar-${slugify(title)}`,
        partner: 'e-solarpower',
        type: category.type,
        title,
        power: cleanValue(extractField(meta, [/Мощность\s*[:\-]?\s*([^\n]+)/i, /(\d+[\.,]?\d*\s*кВт)/i])),
        generationPerDay: cleanValue(extractField(meta, [/Выработка\s*[:\-]?\s*([^\n]+)/i, /(\d+[\.,]?\d*\s*кВт\s*·?ч\/сутки)/i])),
        battery: cleanValue(extractField(meta, [/АКБ\s*[:\-]?\s*([^\n]+)/i, /(\d+[\.,]?\d*\s*кВт\s*·?ч\s*LiFePO4)/i, /(\d+\s*[xх×]\s*\d+\s*Ач)/i])),
        basePrice: parsePrice(priceRaw),
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
