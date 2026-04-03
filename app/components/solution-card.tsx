import type { SolarSolution } from '@/types/solution';
import { calculatePricing, formatPrice } from '@/lib/pricing';

interface Props {
  solution: SolarSolution;
  delivery: number;
  includeDelivery: boolean;
}

const typeImageMap: Record<SolarSolution['type'], string> = {
  'Сетевые': '/images/solutions/grid.svg',
  'Гибридные': '/images/solutions/hybrid.svg',
  'Автономные': '/images/solutions/offgrid.svg',
};

function getStatusBadges(solution: SolarSolution): string[] {
  const badges: string[] = [];
  const title = solution.title.toLowerCase();

  if (title.includes('дом') || title.includes('дача')) {
    badges.push('Для дома');
  } else {
    badges.push('Для бизнеса');
  }

  if (solution.type === 'Сетевые') badges.push('Экономия');
  if (solution.type === 'Гибридные') badges.push('Резерв');
  if (solution.type === 'Автономные') badges.push('Автономия');

  return badges.slice(0, 2);
}

export default function SolutionCard({ solution, delivery, includeDelivery }: Props) {
  const basePrice = solution.basePrice ?? 0;
  const pricing = calculatePricing(basePrice, includeDelivery ? delivery : 0);
  const badges = getStatusBadges(solution);

  return (
    <article className="card solution-card">
      <div className="solution-cover" aria-hidden="true">
        <img src={typeImageMap[solution.type]} alt="" />
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
          <div className="muted">Под ключ (с инсталляцией)</div>
          <div className="price-value">{formatPrice(pricing.turnkey)}</div>
          <small>Монтаж 15%{includeDelivery ? ' + доставка' : ''}</small>
        </div>
      </div>

      <div className="total">
        <div>
          <small>Платформенная рекомендация</small>
          <div className="price-value">{formatPrice(pricing.turnkey)}</div>
        </div>
        <button className="cta">Получить предложение</button>
      </div>

      <div className="meta">Обновлено: {new Date(solution.lastUpdated).toLocaleString('ru-RU')}</div>
    </article>
  );
}
