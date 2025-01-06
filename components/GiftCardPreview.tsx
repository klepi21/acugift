import { format } from 'date-fns';
import { el } from 'date-fns/locale';

export function GiftCardPreview({ 
  sessions, 
  amount, 
  code, 
  purchaserName,
  recipientName,
  purchaseDate = new Date()
}: { 
  sessions: number;
  amount: number;
  code: string;
  purchaserName?: string;
  recipientName?: string;
  purchaseDate?: Date;
}) {
  const formattedDate = format(purchaseDate, 'd MMMM yyyy', { locale: el });

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-[#8B4513]">Δωροκάρτα</h3>
          <p className="text-[#8B4513]/80 text-sm">
            Ημερομηνία: {formattedDate}
          </p>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#8B4513]">{sessions}</div>
            <div className="text-[#8B4513]/80">Συνεδρίες</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-[#8B4513]">{amount}€</div>
            <div className="text-[#8B4513]/80">Αξία</div>
          </div>

          {(purchaserName || recipientName) && (
            <div className="text-center text-[#8B4513] space-y-1">
              {purchaserName && <p>Από: {purchaserName}</p>}
              {recipientName && <p>Προς: {recipientName}</p>}
            </div>
          )}

          <div className="text-center">
            <div className="text-sm font-mono bg-[#8B4513]/5 py-1 px-2 rounded inline-block">
              {code}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 