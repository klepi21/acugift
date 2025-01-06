import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import { GiftIcon } from 'lucide-react';

export function GiftCardPreview({ 
  sessions, 
  amount, 
  code, 
  purchaserName,
  recipientName,
}: { 
  sessions: number;
  amount: number;
  code: string;
  purchaserName?: string;
  recipientName?: string;
}) {
  const today = format(new Date(), 'd MMMM yyyy', { locale: el });

  return (
    <div className="relative w-full aspect-[1.6] bg-gradient-to-br from-[#FBDAC6] to-white rounded-xl shadow-lg overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-white/50" />
      
      <div className="relative h-full p-6 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-[#8B4513]">Δωροκάρτα</h3>
            <p className="text-sm text-[#8B4513]/80">
              {today}
            </p>
          </div>

          <div className="flex items-center gap-2 text-[#8B4513]/80">
            <GiftIcon className="h-5 w-5" />
            <span>Συνεδρίες Ρεφλεξολογίας</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center flex-grow gap-2">
          <div className="text-5xl font-bold text-[#8B4513]">{sessions}</div>
          <div className="text-[#8B4513]/80">Συνεδρίες</div>
          <div className="text-2xl font-bold text-[#8B4513] mt-2">{amount}€</div>
        </div>

        <div className="space-y-3">
          {(purchaserName || recipientName) && (
            <div className="text-center text-[#8B4513] space-y-1">
              {purchaserName && <p>Από: {purchaserName}</p>}
              {recipientName && <p>Προς: {recipientName}</p>}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="text-sm font-mono bg-[#8B4513]/5 py-1 px-3 rounded">
              {code}
            </div>
            <div className="text-sm text-[#8B4513]/80">
              Σας ευχόμαστε όμορφες στιγμές χαλάρωσης!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 