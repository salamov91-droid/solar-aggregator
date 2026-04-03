export default function PartnersSection() {
  return (
    <section className="section" id="partners">
      <div className="section-heading">
        <span className="badge">Партнёры</span>
        <h2>Каталог собирается из ассортимента Volta Energy и e-solarpower</h2>
        <p>На сайте клиента виден ваш интерфейс, а сами решения и базовые цены приходят из вашего серверного слоя парсинга и нормализации.</p>
      </div>
      <div className="partners-grid">
        <article className="partner-card">
          <h3>Volta Energy</h3>
          <p>Сильная линейка сетевых и гибридных решений, техническая подача и широкий ассортимент.</p>
        </article>
        <article className="partner-card">
          <h3>e-solarpower</h3>
          <p>Удобная упаковка по сценариям: экономия, независимость, экономия + резерв.</p>
        </article>
      </div>
    </section>
  );
}
