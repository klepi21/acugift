import { Card } from '@/components/ui/card';
import { CardHeader } from './CardHeader';
import { CardContent } from './CardContent';
import { CardFooter } from './CardFooter';
import { Gift } from 'lucide-react';
import type { GiftCardData } from '@/lib/types';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';

export function GiftCard({ sessions, code, price, purchaseDate = new Date() }: GiftCardData) {
  const formattedDate = format(purchaseDate, 'd MMMM yyyy', { locale: el });

  return (
    <div className="relative">
      {/* Preview Badge */}
      {/* Gift Wrap Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-4 bg-[#8B4513]/10 rounded-t-xl" />
        <div className="absolute top-1/2 left-0 w-full h-4 bg-[#8B4513]/10 -translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-lg">
          <Gift className="h-6 w-6 text-[#8B4513]" />
        </div>
      </div>

      <Card className="w-full max-w-md mx-auto bg-[#FBDAC6] p-8 rounded-xl shadow-xl relative overflow-hidden">
        <div className="text-center space-y-4 relative z-10">
          <CardHeader />
          <CardContent sessions={sessions} price={price} code={code} />
          <div className="text-sm text-[#8B4513]/80">
            {formattedDate}
          </div>

          <CardFooter />
        </div>
      </Card>
    </div>
  );
}