import { PRICING_TIERS, CURRENCY } from '@/lib/constants';

interface PriceInfoProps {
  sessions: number;
}

export function PriceInfo({ sessions }: PriceInfoProps) {
  const tier = PRICING_TIERS.find(
    (t) => sessions >= t.min && sessions <= t.max
  );

  if (!tier) return null;

  const singleSessionPrice = PRICING_TIERS[0].price;
  const savingsPercent = Math.round(((singleSessionPrice - tier.price) / singleSessionPrice) * 100);

  return (
    <div className="text-sm space-y-1">
      {savingsPercent > 0 && (
        <div className="text-green-600 dark:text-green-400">
          Εξοικονομήστε {savingsPercent}% σε σύγκριση με μεμονωμένες συνεδρίες
        </div>
      )}
    </div>
  );
}