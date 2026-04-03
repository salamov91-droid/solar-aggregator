import type { SolutionPricing } from '@/types/solution';

export function calculatePricing(basePrice: number, delivery: number): SolutionPricing {
  const equipment = basePrice;
  const installation = Math.round(basePrice * 0.15);
  const safeDelivery = Math.max(0, delivery || 0);
  const turnkey = equipment + installation + safeDelivery;

  return {
    equipment,
    installation,
    delivery: safeDelivery,
    turnkey,
  };
}

export function formatPrice(value: number | null): string {
  if (value === null || Number.isNaN(value)) {
    return 'По запросу';
  }

  return `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(value)} ₽`;
}
