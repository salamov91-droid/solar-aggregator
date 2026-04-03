export type SolutionType = 'Сетевые' | 'Гибридные' | 'Автономные';

export interface SolarSolution {
  id: string;
  partner: 'Volta Energy' | 'e-solarpower';
  type: SolutionType;
  title: string;
  power: string | null;
  generationPerDay: string | null;
  battery: string | null;
  basePrice: number | null;
  sourceUrl: string;
  categoryUrl: string;
  lastUpdated: string;
}

export interface SolutionPricing {
  equipment: number;
  installation: number;
  delivery: number;
  turnkey: number;
}
