export type ClientObjectType = 'commercial' | 'private_house';
export type GoalType = 'economy' | 'economy_reserve' | 'full_autonomy';
export type GridConnection = 'yes' | 'no';
export type ConsumptionBand = 'small' | 'medium' | 'large';
export type OutageBand = 'never' | 'sometimes' | 'often';

export interface CalculatorAnswers {
  objectType: ClientObjectType;
  hasGrid: GridConnection;
  primaryGoal: GoalType;
  consumptionBand: ConsumptionBand;
  outages: OutageBand;
  preferredPartner: 'all' | 'Volta Energy' | 'e-solarpower';
  delivery: number;
}

export interface RecommendationResult {
  recommendedType: 'Сетевые' | 'Гибридные' | 'Автономные';
  title: string;
  explanation: string;
  reasoning: string[];
}
