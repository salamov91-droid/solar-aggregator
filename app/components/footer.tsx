export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div>
          <strong>Solar Solutions</strong>
          <p>Витрина решений по солнечной энергетике с собственным дизайном, калькулятором подбора и подгрузкой цен с сайтов партнёров.</p>
        </div>
        <div>
          <strong>Разделы</strong>
          <ul>
            <li><a href="/catalog">Каталог решений</a></li>
            <li><a href="/calculator">Подборщик</a></li>
            <li><a href="#services">Монтаж и доставка</a></li>
          </ul>
        </div>
        <div>
          <strong>Коммерческие опции</strong>
          <ul>
            <li>Монтаж: 15% от оборудования</li>
            <li>Доставка: по региону или вручную</li>
            <li>Инсталляция под ключ</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
