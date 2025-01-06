export const PRICING_TIERS = [
  { min: 1, max: 1, price: 50 },
  { min: 2, max: 2, price: 40 },
  { min: 3, max: 5, price: 35 },
  { min: 6, max: 8, price: 32 },
  { min: 9, max: 10, price: 30 },
] as const;

export const GIFT_CARD_VALIDITY_DAYS = 90;

export const CURRENCY = {
  symbol: '€',
  code: 'EUR',
} as const;