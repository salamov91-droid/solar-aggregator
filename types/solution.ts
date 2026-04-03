export type SolutionType = 'Сетевые' | 'Гибридные' | 'Автономные';
export type SolutionSegment = 'Для дома' | 'Для бизнеса';
export type SolutionScenario = 'Экономия' | 'Экономия + резерв' | 'Автономия';

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
  imageUrl?: string | null;
  segment?: SolutionSegment;
  scenario?: SolutionScenario;
}

export interface SolutionPricing {
  equipment: number;
  installation: number;
  delivery: number;
  turnkey: number;
}
