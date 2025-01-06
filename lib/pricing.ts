import { PRICING_TIERS } from './constants';

export const calculatePrice = (sessions: number): number => {
  const tier = PRICING_TIERS.find(
    (t) => sessions >= t.min && sessions <= t.max
  );
  
  return tier ? sessions * tier.price : 0;
};