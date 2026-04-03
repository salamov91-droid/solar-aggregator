import type { SolarSolution } from '@/types/solution';
import { calculatePricing, formatPrice } from '@/lib/pricing';

interface Props {
  solution: SolarSolution;
  delivery: number;
  includeInstallation: boolean;
  includeDelivery: boolean;
  showTurnkey: boolean;
}

const typeImageMap: Record<SolarSolution['type'], string> = {
  'Сетевые': '/images/solutions/grid.svg',
  'Гибридные': '/images/solutions/hybrid.svg',
  'Автономные': '/images/solutions/offgrid.svg',
};

export default function SolutionCard({ solution, delivery, includeInstallation, includeDelivery, showTurnkey }: Props) {
  const basePrice = solution.basePrice ?? 0;
  const pricing = calculatePricing(basePrice, includeDelivery ? delivery : 0);
  const total = showTurnkey
    ? pricing.turnkey
    : pricing.equipment + (includeInstallation ? pricing.installation : 0) + (includeDelivery ? pricing.delivery : 0);

  return (
    <article className="card">
      <div className="solution-cover" aria-hidden="true">
        <img src={typeImageMap[solution.type]} alt="" />
      </div>

      <div className="card-top">
        <div>
          <div className="tags">
            <span className="tag">{solution.type}</span>
          </div>
          <h2>{solution.title}</h2>
        </div>
        <a className="link-btn" href={solution.sourceUrl} target="_blank" rel="noreferrer">Источник</a>
      </div>

      <div className="specs">
        <div className="spec"><div className="spec-title">Мощность</div><div className="spec-value">{solution.power ?? '—'}</div></div>
        <div className="spec"><div className="spec-title">Выработка</div><div className="spec-value">{solution.generationPerDay ?? '—'}</div></div>
        <div className="spec"><div className="spec-title">АКБ</div><div className="spec-value">{solution.battery ?? '—'}</div></div>
      </div>

      <div className="prices">
        <div className="price-box"><div className="muted">Оборудование</div><div className="price-value">{formatPrice(solution.basePrice)}</div></div>
        <div className="price-box"><div className="muted">Монтаж 15%</div><div className="price-value">{formatPrice(pricing.installation)}</div></div>
        <div className="price-box"><div className="muted">Доставка</div><div className="price-value">{formatPrice(pricing.delivery)}</div></div>
        <div className="price-box"><div className="muted">Под ключ</div><div className="price-value">{formatPrice(pricing.turnkey)}</div></div>
      </div>

      <div className="total">
        <div>
          <small>Итог с выбранными опциями</small>
          <div className="price-value">{formatPrice(total)}</div>
        </div>
        <button className="cta">Оставить заявку</button>
      </div>

      <div className="meta">Обновлено: {new Date(solution.lastUpdated).toLocaleString('ru-RU')}</div>
    </article>
  );
}
