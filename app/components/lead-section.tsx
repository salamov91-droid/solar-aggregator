export default function LeadSection() {
  return (
    <section className="section section--accent" id="lead">
      <div className="section-heading">
        <span className="badge badge--dark">Лиды</span>
        <h2>Готово к подключению формы заявки</h2>
        <p>Сейчас блок — как интерфейсный шаблон. Следующим этапом его можно связать с почтой, Telegram, CRM или Bitrix24.</p>
      </div>
      <form className="lead-form">
        <input placeholder="Имя" />
        <input placeholder="Телефон или email" />
        <input placeholder="Тип объекта" />
        <button type="button" className="button">Отправить заявку</button>
      </form>
    </section>
  );
}
