'use client';

import { useMemo, useState } from 'react';
import type { SolarSolution } from '@/types/solution';
import FiltersPanel from '@/app/components/filters-panel';
import SolutionCard from '@/app/components/solution-card';

interface Props {
  solutions: SolarSolution[];
  title?: string;
  description?: string;
}

export default function CatalogClient({
  solutions,
  title = 'Каталог решений по солнечной энергетике',
  description = 'Профессиональная витрина Solar Solutions: единый стандарт презентации, прозрачная математика стоимости и быстрый путь к коммерческому предложению.',
}: Props) {
  const [type, setType] = useState('Все');
  const [search, setSearch] = useState('');
  const [delivery, setDelivery] = useState(0);
  const [tariff, setTariff] = useState(7);
  const [includeDelivery, setIncludeDelivery] = useState(true);

  const filtered = useMemo(() => {
    return solutions.filter((solution) => {
      const matchesType = type === 'Все' || solution.type === type;
      const haystack = [solution.title, solution.type, solution.power ?? '', solution.generationPerDay ?? '']
        .join(' ')
        .toLowerCase();
      const matchesSearch = haystack.includes(search.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [solutions, type, search]);

  const averagePrice = useMemo(() => {
    const priced = filtered.filter((item) => item.basePrice);
    if (!priced.length) return null;
    const sum = priced.reduce((acc, item) => acc + (item.basePrice ?? 0), 0);
    return Math.round(sum / priced.length);
  }, [filtered]);

  return (
    <>
      <section className="hero hero--catalog hero--catalog-premium">
        <div>
          <span className="badge">Каталог платформы</span>
          <h1>{title}</h1>
          <p>{description}</p>
          <div className="hero-points">
            <span>Единый стандарт карточек</span>
            <span>Расчёт цены под ключ</span>
            <span>Быстрая заявка в отдел продаж</span>
          </div>
        </div>
      </section>

      <section className="panel control-panel">
        <FiltersPanel
          type={type}
          setType={setType}
          search={search}
          setSearch={setSearch}
          delivery={delivery}
          setDelivery={setDelivery}
          tariff={tariff}
          setTariff={setTariff}
        />

        <div className="summary-bar">
          <div className="summary-bar__item">
            <small>Найдено решений</small>
            <strong>{filtered.length}</strong>
          </div>
          <div className="summary-bar__item">
            <small>Тип</small>
            <strong>{type}</strong>
          </div>
          <div className="summary-bar__item">
            <small>Средняя цена оборудования</small>
            <strong>{averagePrice ? `${new Intl.NumberFormat('ru-RU').format(averagePrice)} ₽` : '—'}</strong>
          </div>
          <div className="summary-bar__item">
            <small>Тариф для расчёта окупаемости</small>
            <strong>{tariff.toLocaleString('ru-RU')} ₽/кВт·ч</strong>
          </div>
          <label className="option option--chip">
            <input type="checkbox" checked={includeDelivery} onChange={(e) => setIncludeDelivery(e.target.checked)} />
            Учитывать доставку в «Под ключ»
          </label>
        </div>
      </section>

      {filtered.length === 0 ? (
        <section className="hero empty-state">
          <h2>Ничего не найдено</h2>
          <p>Попробуйте изменить поисковый запрос, тип решения или параметры доставки.</p>
          <button className="button" onClick={() => { setType('Все'); setSearch(''); setDelivery(0); setTariff(7); setIncludeDelivery(true); }}>
            Сбросить фильтры
          </button>
        </section>
      ) : (
        <section className="grid">
          {filtered.map((solution) => (
            <SolutionCard
              key={solution.id}
              solution={solution}
              delivery={delivery}
              includeDelivery={includeDelivery}
              tariff={tariff}
            />
          ))}
        </section>
      )}
    </>
  );
}
