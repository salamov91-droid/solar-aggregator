import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="hero hero--landing">
      <div>
        <span className="badge">Solar Solutions Platform</span>
        <h1>Платформа подбора и продажи солнечных решений для дома и бизнеса</h1>
        <p>
          Современный интерфейс, понятная коммерческая логика и единый стандарт презентации решений.
          Расчёт стоимости оборудования и цены «под ключ» в одном сценарии продаж.
        </p>
        <div className="hero-actions">
          <Link href="/catalog" className="button">Открыть каталог</Link>
          <Link href="/calculator" className="button button--ghost">Получить smart-подбор</Link>
        </div>
      </div>
      <div className="hero-card">
        <div className="hero-card__stat"><strong>24/7</strong><span>доступ к каталогу</span></div>
        <div className="hero-card__stat"><strong>3</strong><span>типа решений</span></div>
        <div className="hero-card__stat"><strong>15%</strong><span>модель монтажа</span></div>
        <div className="hero-card__note">Clean-tech дизайн для коммерческих заявок и уверенной продажи.</div>
      </div>
    </section>
  );
}
