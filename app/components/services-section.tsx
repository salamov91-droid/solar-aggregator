export default function ServicesSection() {
  return (
    <section className="section" id="services">
      <div className="section-heading">
        <span className="badge">Услуги</span>
        <h2>Не только каталог, но и готовая коммерческая модель</h2>
        <p>На каждое решение автоматически накладываются ваши дополнительные услуги и формируется итоговая цена для клиента.</p>
      </div>
      <div className="feature-grid">
        <article className="feature-card">
          <h3>Монтаж</h3>
          <p>Стоимость монтажа считается автоматически как 15% от стоимости оборудования.</p>
        </article>
        <article className="feature-card">
          <h3>Доставка</h3>
          <p>Можно использовать фиксированную сумму, региональный тариф или ручной ввод.</p>
        </article>
        <article className="feature-card">
          <h3>Под ключ</h3>
          <p>Итоговая стоимость складывается из оборудования, монтажа и доставки.</p>
        </article>
      </div>
    </section>
  );
}
