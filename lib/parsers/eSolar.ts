import type { SolarSolution, SolutionScenario, SolutionSegment, SolutionType } from '@/types/solution';
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

function inferScenario(type: SolutionType): SolutionScenario {
  if (type === 'Гибридные') return 'Экономия + резерв';
  if (type === 'Автономные') return 'Автономия';
  return 'Экономия';
}

function inferSegment(categoryUrl: string, title: string): SolutionSegment {
  const value = `${categoryUrl} ${title}`.toLowerCase();
  return value.includes('predpriyatiy') || value.includes('предпр') ? 'Для бизнеса' : 'Для дома';
}

function resolveUrl(href: string | undefined, fallback: string): string {
  if (!href) return fallback;
  if (href.startsWith('http')) return href;
  return `https://e-solarpower.ru${href}`;
}

const cardSelector = [
  '.product-layout',
  '.product-thumb',
  '.product-grid',
  '.product-item',
  '[class*="product-layout"]',
  '[class*="product-thumb"]',
].join(', ');

export async function scrapeESolarSolutions(): Promise<SolarSolution[]> {
  const results: SolarSolution[] = [];
  let totalCardsFound = 0;

  for (const category of categories) {
    const html = await fetchHtml(category.url);
    const $ = load(html);

    const cards = $(cardSelector);
    totalCardsFound += cards.length;

    console.info(`[scraper][e-solar] ${category.url} cardsFound=${cards.length}`);

    if (!cards.length) {
      console.warn(`[scraper][e-solar] No cards found for ${category.url}`);
      continue;
    }

    cards.each((_, node) => {
      const title = normalizeWhitespace($(node).find('.caption h4, .caption h4 a, .product-name, h4 a, .name, [class*=name]').first().text());
      const href = $(node).find('a[href]').first().attr('href') ?? category.url;
      const priceRaw = normalizeWhitespace($(node).find('.price, .price-new, .caption .price, [class*=price]').first().text());
      const meta = normalizeWhitespace($(node).text());
      const imageRaw = $(node).find('img').first().attr('src') ?? $(node).find('img').first().attr('data-src') ?? $(node).find('img').first().attr('data-lazy') ?? null;

      if (!title) return;

      const sourceUrl = resolveUrl(href, category.url);
      const imageUrl = imageRaw ? resolveUrl(imageRaw, category.url) : null;

      results.push({
        id: `esolar-${slugify(sourceUrl.replace('https://e-solarpower.ru', ''))}`,
        partner: 'e-solarpower',
        type: category.type,
        scenario: inferScenario(category.type),
        segment: inferSegment(category.url, title),
        title,
        power: cleanValue(extractField(meta, [/Мощность\s*[:\-]?\s*([^\n]+)/i, /(\d+[\.,]?\d*\s*кВт)/i])),
        generationPerDay: cleanValue(extractField(meta, [/Выработка\s*[:\-]?\s*([^\n]+)/i, /(\d+[\.,]?\d*\s*кВт\s*·?ч\/сутки)/i])),
        battery: cleanValue(extractField(meta, [/АКБ\s*[:\-]?\s*([^\n]+)/i, /(\d+[\.,]?\d*\s*кВт\s*·?ч\s*LiFePO4)/i, /(\d+\s*[xх×]\s*\d+\s*Ач)/i])),
        basePrice: parsePrice(priceRaw),
        sourceUrl,
        imageUrl,
        categoryUrl: category.url,
        lastUpdated: new Date().toISOString(),
      });
    });
  }

  const deduped = dedupe(results);

  console.info(`[scraper][e-solar] parsed=${results.length}, deduped=${deduped.length}, cardsFound=${totalCardsFound}`);

  return deduped;
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
