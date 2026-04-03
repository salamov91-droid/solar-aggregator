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
  description = 'Все решения от партнеров в одном интерфейсе: сетевые, гибридные и автономные станции с расчётом монтажа, доставки и стоимости под ключ.',
}: Props) {
  const [partner, setPartner] = useState('Все');
  const [type, setType] = useState('Все');
  const [search, setSearch] = useState('');
  const [delivery, setDelivery] = useState(0);
  const [includeInstallation, setIncludeInstallation] = useState(true);
  const [includeDelivery, setIncludeDelivery] = useState(true);
  const [showTurnkey, setShowTurnkey] = useState(true);

  const filtered = useMemo(() => {
    return solutions.filter((solution) => {
      const matchesPartner = partner === 'Все' || solution.partner === partner;
      const matchesType = type === 'Все' || solution.type === type;
      const haystack = [solution.title, solution.partner, solution.type, solution.power ?? '', solution.generationPerDay ?? '']
        .join(' ')
        .toLowerCase();
      const matchesSearch = haystack.includes(search.toLowerCase());
      return matchesPartner && matchesType && matchesSearch;
    });
  }, [solutions, partner, type, search]);

  return (
    <>
      <section className="hero hero--catalog">
        <span className="badge">Каталог</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </section>

      <FiltersPanel
        partner={partner}
        setPartner={setPartner}
        type={type}
        setType={setType}
        search={search}
        setSearch={setSearch}
        delivery={delivery}
        setDelivery={setDelivery}
      />

      <section className="hero toolbar">
        <div className="options">
          <label className="option"><input type="checkbox" checked={includeInstallation} onChange={(e) => setIncludeInstallation(e.target.checked)} /> Монтаж 15%</label>
          <label className="option"><input type="checkbox" checked={includeDelivery} onChange={(e) => setIncludeDelivery(e.target.checked)} /> Добавить доставку</label>
          <label className="option"><input type="checkbox" checked={showTurnkey} onChange={(e) => setShowTurnkey(e.target.checked)} /> Показывать цену под ключ</label>
        </div>
        <div className="muted">Найдено решений: <strong>{filtered.length}</strong></div>
      </section>

      <section className="grid">
        {filtered.map((solution) => (
          <SolutionCard
            key={solution.id}
            solution={solution}
            delivery={delivery}
            includeInstallation={includeInstallation}
            includeDelivery={includeDelivery}
            showTurnkey={showTurnkey}
          />
        ))}
      </section>
    </>
  );
}
