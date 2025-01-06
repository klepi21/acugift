"use client";

import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PaymentErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FBDAC6] to-white py-12 px-4">
      <Card className="max-w-md mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold text-[#8B4513] text-center">
          Σφάλμα Πληρωμής
        </h1>
        <p className="text-[#8B4513] text-center">
          {error || 'Υπήρξε ένα πρόβλημα με την πληρωμή σας'}
        </p>
        <div className="flex justify-center">
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-[#8B4513] hover:bg-[#6d3610]"
          >
            Προσπαθήστε ξανά
          </Button>
        </div>
      </Card>
    </main>
  );
}