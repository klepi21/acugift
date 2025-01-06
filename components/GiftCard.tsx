import React from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface GiftCardProps {
  sessions: number;
  code?: string;
  price: number;
}

export function GiftCard({ sessions, code, price }: GiftCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto bg-[#FBDAC6] p-8 rounded-xl shadow-xl">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Sparkles className="h-12 w-12 text-[#8B4513]" />
        </div>
        <h2 className="text-2xl font-bold text-[#8B4513]">Acupuncture Gift Card</h2>
        <div className="text-lg font-medium text-[#8B4513]">
          {sessions} {sessions === 1 ? 'Session' : 'Sessions'}
        </div>
        <div className="text-3xl font-bold text-[#8B4513]">${price}</div>
        {code && (
          <div className="mt-4 p-4 bg-white/50 rounded-lg">
            <p className="text-sm text-[#8B4513] mb-1">Redemption Code</p>
            <p className="text-2xl font-mono font-bold tracking-wider text-[#8B4513]">
              {code}
            </p>
          </div>
        )}
        <div className="text-sm text-[#8B4513] mt-4">
          Valid for one year from purchase date
        </div>
      </div>
    </Card>
  );
}