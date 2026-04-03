import Link from 'next/link';
import type { SolarSolution } from '@/types/solution';
import { calculatePricing, formatPrice } from '@/lib/pricing';

interface Props {
  solution: SolarSolution;
  delivery: number;
  includeDelivery: boolean;
  tariff: number;
}

const typeImageMap: Record<SolarSolution['type'], string> = {
  'Сетевые': '/images/solutions/grid.svg',
  'Гибридные': '/images/solutions/hybrid.svg',
  'Автономные': '/images/solutions/offgrid.svg',
};

function parseGenerationPerDay(value: string | null): number | null {
  if (!value) return null;
  const normalized = value.replace(',', '.');
  const match = normalized.match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function calculatePaybackYears(turnkey: number, tariff: number, generationPerDay: string | null): number | null {
  const generation = parseGenerationPerDay(generationPerDay);
  if (!generation || generation <= 0 || tariff <= 0 || turnkey <= 0) return null;

  const monthlyBenefit = generation * tariff * 30;
  if (monthlyBenefit <= 0) return null;

  const months = turnkey / monthlyBenefit;
  return months / 12;
}

function getStatusBadges(solution: SolarSolution): string[] {
  const badges: string[] = [];
  badges.push(solution.segment ?? 'Для бизнеса');
  badges.push(solution.scenario ?? (solution.type === 'Сетевые' ? 'Экономия' : solution.type === 'Гибридные' ? 'Резерв' : 'Автономия'));
  return badges;
}

export default function SolutionCard({ solution, delivery, includeDelivery, tariff }: Props) {
  const basePrice = solution.basePrice ?? 0;
  const pricing = calculatePricing(basePrice, includeDelivery ? delivery : 0);
  const badges = getStatusBadges(solution);
  const coverImage = solution.imageUrl ?? typeImageMap[solution.type];
  const paybackYears = calculatePaybackYears(pricing.turnkey, tariff, solution.generationPerDay);

  return (
    <Link href={`/solutions/${solution.id}`} className="solution-card-link" aria-label={`Открыть решение ${solution.title}`}>
      <article className="card solution-card">
        <div className="solution-cover" aria-hidden="true">
          <img src={coverImage} alt="" />
          <div className="solution-cover__overlay" />
          <div className="solution-cover__content">
            <span className="tag tag--light">{solution.type}</span>
            <h2>{solution.title}</h2>
            <div className="tags tags--cover">
              {badges.map((badge) => <span key={badge} className="tag tag--light-outline">{badge}</span>)}
            </div>
          </div>
        </div>

        <div className="specs">
          <div className="spec"><div className="spec-title">Мощность</div><div className="spec-value">{solution.power ?? '—'}</div></div>
          <div className="spec"><div className="spec-title">Выработка</div><div className="spec-value">{solution.generationPerDay ?? '—'}</div></div>
          <div className="spec"><div className="spec-title">АКБ</div><div className="spec-value">{solution.battery ?? '—'}</div></div>
        </div>

        <div className="prices prices--duo">
          <div className="price-box">
            <div className="muted">Стоимость оборудования</div>
            <div className="price-value">{formatPrice(solution.basePrice)}</div>
          </div>
          <div className="price-box price-box--accent">
            <div className="muted">Под ключ</div>
            <div className="price-value">{formatPrice(pricing.turnkey)}</div>
            <small>Доставка, монтаж, пусконаладочные работы</small>
          </div>
        </div>

        <div className="payback-box">
          <small>Срок окупаемости (по вашему тарифу)</small>
          <strong>{paybackYears ? `${paybackYears.toFixed(1)} лет` : 'Недостаточно данных для расчёта'}</strong>
        </div>

        <div className="total">
          <div>
            <small>Платформенная рекомендация</small>
            <div className="price-value">{formatPrice(pricing.turnkey)}</div>
          </div>
          <span className="cta">Получить предложение</span>
        </div>

        <div className="meta">Обновлено: {new Date(solution.lastUpdated).toLocaleString('ru-RU')}</div>
      </article>
    </Link>
  );
}
