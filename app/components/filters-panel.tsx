import type { SolutionType } from '@/types/solution';

interface Props {
  partner: string;
  setPartner: (value: string) => void;
  type: string;
  setType: (value: string) => void;
  search: string;
  setSearch: (value: string) => void;
  delivery: number;
  setDelivery: (value: number) => void;
}

export default function FiltersPanel({
  partner,
  setPartner,
  type,
  setType,
  search,
  setSearch,
  delivery,
  setDelivery,
}: Props) {
  const types: Array<'Все' | SolutionType> = ['Все', 'Сетевые', 'Гибридные', 'Автономные'];

  return (
    <section className="filters">
      <div className="panel">
        <label htmlFor="search">Поиск</label>
        <input id="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="5 кВт, Дом-2, гибрид" />
      </div>
      <div className="panel">
        <label htmlFor="partner">Партнёр</label>
        <select id="partner" value={partner} onChange={(e) => setPartner(e.target.value)}>
          <option>Все</option>
          <option>Volta Energy</option>
          <option>e-solarpower</option>
        </select>
      </div>
      <div className="panel">
        <label htmlFor="type">Тип решения</label>
        <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
          {types.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <div className="panel">
        <label htmlFor="delivery">Доставка, ₽</label>
        <input id="delivery" type="number" min={0} value={delivery} onChange={(e) => setDelivery(Number(e.target.value || 0))} />
      </div>
    </section>
  );
}
