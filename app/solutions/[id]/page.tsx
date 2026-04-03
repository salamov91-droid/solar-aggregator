import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/app/components/header';
import Footer from '@/app/components/footer';
import { getSolutions } from '@/lib/solutions';
import { calculatePricing, formatPrice } from '@/lib/pricing';

interface PageProps {
  params: Promise<{ id: string }>;
}

function getScenarioDescription(scenario: string | undefined) {
  if (scenario === 'Автономия') {
    return 'Решение ориентировано на объекты, где критична энергонезависимость и стабильная работа без опоры на внешнюю сеть.';
  }
  if (scenario === 'Экономия + резерв') {
    return 'Сценарий для объектов, которым важно одновременно снижать расходы на электроэнергию и иметь резерв при отключениях.';
  }
  return 'Оптимальный сценарий для снижения затрат на электроэнергию при подключении к сети.';
}

export default async function SolutionPage({ params }: PageProps) {
  const { id } = await params;
  const solutions = await getSolutions();
  const solution = solutions.find((item) => item.id === id);

  if (!solution) {
    notFound();
  }

  const pricing = calculatePricing(solution.basePrice ?? 0, 0);
  const scenario = solution.scenario ?? (solution.type === 'Сетевые' ? 'Экономия' : solution.type === 'Гибридные' ? 'Экономия + резерв' : 'Автономия');
  const segment = solution.segment ?? 'Для бизнеса';

  return (
    <div className="page">
      <Header />
      <main className="container">
        <Link href="/catalog" className="back-link">← Вернуться в каталог</Link>

        <section className="hero solution-hero">
          <span className="badge">{solution.type}</span>
          <h1>{solution.title}</h1>
          <p>{getScenarioDescription(scenario)}</p>
          <div className="hero-points">
            <span>{segment}</span>
            <span>{scenario}</span>
            <span>Solar Solutions Recommendation</span>
          </div>
        </section>

        <section className="solution-layout">
          <article className="card solution-details">
            <h2>Что получает клиент</h2>
            <ul>
              <li>Снижение затрат на электроэнергию и прогнозируемая экономика проекта.</li>
              <li>Готовый сценарий внедрения для объекта: {segment.toLowerCase()}.</li>
              <li>Поддержка полного цикла: проектирование, поставка, пуск.</li>
            </ul>

            <h3>Технические характеристики</h3>
            <div className="specs specs--details">
              <div className="spec"><div className="spec-title">Мощность</div><div className="spec-value">{solution.power ?? '—'}</div></div>
              <div className="spec"><div className="spec-title">Выработка</div><div className="spec-value">{solution.generationPerDay ?? '—'}</div></div>
              <div className="spec"><div className="spec-title">АКБ</div><div className="spec-value">{solution.battery ?? '—'}</div></div>
            </div>

            <h3>Состав поставки</h3>
            <p>Фото-комплектация на источнике может отличаться. Итоговый комплект подтверждается коммерческим предложением: панели, инвертор, крепёж, кабельная часть, настройка и ввод в эксплуатацию.</p>
          </article>

          <aside className="card solution-pricing">
            <h3>Стоимость проекта</h3>
            <div className="price-box">
              <div className="muted">Оборудование</div>
              <div className="price-value">{formatPrice(solution.basePrice)}</div>
            </div>
            <div className="price-box price-box--accent">
              <div className="muted">Под ключ</div>
              <div className="price-value">{formatPrice(pricing.turnkey)}</div>
              <small>Доставка, монтаж, пусконаладочные работы</small>
            </div>
            <button className="button">Получить предложение</button>
            <button className="button button--ghost">Оставить заявку</button>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}
