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
  description = 'Сетевые, гибридные и автономные станции с прозрачным расчётом стоимости оборудования и цены под ключ.',
}: Props) {
  const [type, setType] = useState('Все');
  const [search, setSearch] = useState('');
  const [delivery, setDelivery] = useState(0);
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

  return (
    <>
      <section className="hero hero--catalog">
        <span className="badge">Каталог</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </section>

      <FiltersPanel
        type={type}
        setType={setType}
        search={search}
        setSearch={setSearch}
        delivery={delivery}
        setDelivery={setDelivery}
      />

      <section className="hero toolbar">
        <div className="options">
          <label className="option"><input type="checkbox" checked={includeDelivery} onChange={(e) => setIncludeDelivery(e.target.checked)} /> Добавить доставку в «Под ключ»</label>
        </div>
        <div className="muted">Найдено решений: <strong>{filtered.length}</strong></div>
      </section>

      {filtered.length === 0 ? (
        <section className="hero empty-state">
          <h2>Ничего не найдено</h2>
          <p>Попробуйте изменить поисковый запрос или сбросить фильтры.</p>
          <button className="button" onClick={() => { setType('Все'); setSearch(''); setDelivery(0); setIncludeDelivery(true); }}>
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
            />
          ))}
        </section>
      )}
    </>
  );
}
