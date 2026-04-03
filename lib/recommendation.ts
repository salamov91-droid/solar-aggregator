import type { SolarSolution, SolutionType } from '@/types/solution';
import type { CalculatorAnswers, RecommendationResult } from '@/types/calculator';

const defaultAnswers: CalculatorAnswers = {
  objectType: 'private_house',
  hasGrid: 'yes',
  primaryGoal: 'economy',
  consumptionBand: 'medium',
  outages: 'never',
  preferredPartner: 'all',
  delivery: 0,
};

function inferRecommendedType(answers: CalculatorAnswers): RecommendationResult {
  const reasoning: string[] = [];
  let recommendedType: SolutionType = 'Сетевые';

  if (answers.hasGrid === 'no' || answers.primaryGoal === 'full_autonomy') {
    recommendedType = 'Автономные';
    reasoning.push('Объекту требуется работа без обязательной опоры на централизованную сеть.');
  } else if (answers.primaryGoal === 'economy_reserve' || answers.outages === 'often') {
    recommendedType = 'Гибридные';
    reasoning.push('Клиенту важны и экономия, и резерв питания при отключениях.');
  } else {
    recommendedType = 'Сетевые';
    reasoning.push('Основной сценарий — снижение счета за электроэнергию при наличии сети.');
  }

  if (answers.objectType === 'commercial') {
    reasoning.push('Для коммерческого объекта приоритетом является окупаемость и покрытие дневной нагрузки.');
  } else {
    reasoning.push('Для частного дома критична простота владения и соответствие бытовому профилю нагрузки.');
  }

  if (answers.consumptionBand === 'large') {
    reasoning.push('Выбран высокий уровень потребления, поэтому в выдаче выше поднимаются более мощные решения.');
  }

  return {
    recommendedType,
    title:
      recommendedType === 'Сетевые'
        ? 'Рекомендуем сетевую солнечную электростанцию'
        : recommendedType === 'Гибридные'
          ? 'Рекомендуем гибридную солнечную электростанцию'
          : 'Рекомендуем автономную солнечную электростанцию',
    explanation:
      recommendedType === 'Сетевые'
        ? 'Подходит объектам с подключением к сети, где главная цель — экономия на электроэнергии без удорожания проекта аккумуляторами.'
        : recommendedType === 'Гибридные'
          ? 'Подходит при наличии сети, когда помимо экономии нужна защита от отключений и резерв питания.'
          : 'Подходит объектам без стабильной сети или там, где нужен полностью самостоятельный источник энергии.',
    reasoning,
  };
}

function extractNumericPower(power: string | null): number {
  if (!power) return 0;
  const match = power.replace(',', '.').match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

function scoreSolution(solution: SolarSolution, answers: CalculatorAnswers, recommendedType: SolutionType): number {
  let score = 0;

  if (solution.type === recommendedType) score += 100;
  if (answers.preferredPartner !== 'all' && solution.partner === answers.preferredPartner) score += 25;

  const power = extractNumericPower(solution.power);
  const targetRanges = {
    small: [0, answers.objectType === 'commercial' ? 10 : 5],
    medium: [answers.objectType === 'commercial' ? 5 : 3, answers.objectType === 'commercial' ? 40 : 10],
    large: [answers.objectType === 'commercial' ? 20 : 8, 1000],
  } as const;

  const [minPower, maxPower] = targetRanges[answers.consumptionBand];
  if (power >= minPower && power <= maxPower) score += 30;

  if (answers.objectType === 'commercial' && power >= 20) score += 15;
  if (answers.objectType === 'private_house' && power > 0 && power <= 15) score += 15;

  if (recommendedType === 'Гибридные' && solution.battery) score += 20;
  if (recommendedType === 'Автономные' && solution.battery) score += 15;
  if (recommendedType === 'Сетевые' && !solution.battery) score += 10;

  if (solution.basePrice) {
    if (answers.objectType === 'private_house' && solution.basePrice <= 450000) score += 10;
    if (answers.objectType === 'commercial' && solution.basePrice >= 1000000) score += 10;
  }

  return score;
}

export function getRecommendation(answersPartial: Partial<CalculatorAnswers>, solutions: SolarSolution[]) {
  const answers: CalculatorAnswers = { ...defaultAnswers, ...answersPartial };
  const recommendation = inferRecommendedType(answers);

  const filtered = solutions.filter((solution) => {
    if (solution.type !== recommendation.recommendedType) return false;
    if (answers.preferredPartner !== 'all' && solution.partner !== answers.preferredPartner) return false;
    return true;
  });

  const ranked = [...filtered].sort((a, b) => {
    const scoreA = scoreSolution(a, answers, recommendation.recommendedType);
    const scoreB = scoreSolution(b, answers, recommendation.recommendedType);
    if (scoreA !== scoreB) return scoreB - scoreA;
    return (a.basePrice ?? Number.MAX_SAFE_INTEGER) - (b.basePrice ?? Number.MAX_SAFE_INTEGER);
  });

  return {
    answers,
    recommendation,
    matches: ranked,
    bestMatch: ranked[0] ?? null,
  };
}
