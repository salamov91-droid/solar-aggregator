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

export default function SolutionCard({ solution, delivery, includeDelivery }: Props) {
  const basePrice = solution.basePrice ?? 0;
  const pricing = calculatePricing(basePrice, includeDelivery ? delivery : 0);

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
          <small>Итоговая цена под ключ</small>
          <div className="price-value">{formatPrice(pricing.turnkey)}</div>
        </div>
        <button className="cta">Оставить заявку</button>
      </div>

      <div className="meta">Обновлено: {new Date(solution.lastUpdated).toLocaleString('ru-RU')}</div>
    </article>
  );
}
