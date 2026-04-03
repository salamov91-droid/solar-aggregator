import type { SolutionType } from '@/types/solution';

interface Props {
  type: string;
  setType: (value: string) => void;
  search: string;
  setSearch: (value: string) => void;
  delivery: number;
  setDelivery: (value: number) => void;
}

export default function FiltersPanel({
  type,
  setType,
  search,
  setSearch,
  delivery,
  setDelivery,
}: Props) {
  const types: Array<'Все' | SolutionType> = ['Все', 'Сетевые', 'Гибридные', 'Автономные'];

  return (
    <div className="filters filters--compact">
      <label className="filter-field">
        <span>Поиск</span>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="5 кВт, Дом-2, гибрид" />
      </label>

      <label className="filter-field">
        <span>Тип решения</span>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {types.map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>

      <label className="filter-field">
        <span>Доставка, ₽</span>
        <input type="number" min={0} value={delivery} onChange={(e) => setDelivery(Number(e.target.value || 0))} />
      </label>
    </div>
  );
}
