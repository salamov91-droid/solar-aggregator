import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="hero hero--landing">
      <div>
        <span className="badge">Каталог решений от двух партнёров</span>
        <h1>Ваш собственный сайт по солнечной энергетике с живыми ценами, подбором и коммерческими опциями</h1>
        <p>
          Показывайте клиенту свой бренд и свою упаковку, а каталог решений подгружайте с сайтов партнёров.
          Дополнительно считайте монтаж, доставку и стоимость под ключ.
        </p>
        <div className="hero-actions">
          <Link href="/catalog" className="button">Открыть каталог</Link>
          <Link href="/calculator" className="button button--ghost">Запустить подборщик</Link>
        </div>
      </div>
      <div className="hero-card">
        <div className="hero-card__stat"><strong>2</strong><span>партнёра</span></div>
        <div className="hero-card__stat"><strong>3</strong><span>типа решений</span></div>
        <div className="hero-card__stat"><strong>15%</strong><span>монтаж</span></div>
        <div className="hero-card__note">Сетевые, гибридные и автономные станции в одном интерфейсе.</div>
      </div>
    </section>
  );
}
