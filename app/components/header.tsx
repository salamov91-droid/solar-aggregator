import Link from 'next/link';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="brand">
          <span className="brand__mark">☀</span>
          <span>
            <strong>Solar Solutions</strong>
            <small>Ваш каталог готовых СЭС</small>
          </span>
        </Link>
        <nav className="nav">
          <Link href="/catalog">Каталог</Link>
          <Link href="/calculator">Калькулятор</Link>
          <a href="#services">Услуги</a>
          <a href="#partners">Партнёры</a>
        </nav>
        <a className="button button--ghost" href="#lead">Оставить заявку</a>
      </div>
    </header>
  );
}
