export default function StatsStrip() {
  const items = [
    ['Сетевые решения', 'Для максимальной экономии при наличии сети'],
    ['Гибридные решения', 'Для экономии и резерва при отключениях'],
    ['Автономные решения', 'Для объектов без стабильной сети'],
  ];

  return (
    <section className="stats-strip">
      {items.map(([title, text]) => (
        <article className="stats-strip__item" key={title}>
          <strong>{title}</strong>
          <p>{text}</p>
        </article>
      ))}
    </section>
  );
}
