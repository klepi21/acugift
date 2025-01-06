import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FBDAC6] to-white py-12 px-4">
      <Card className="max-w-md mx-auto p-8 text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-[#8B4513]">
          Payment Successful!
        </h1>
        
        <p className="text-gray-600">
          Your gift card details have been sent to your email address. You can print
          the gift card or forward the email to your recipient.
        </p>

        <Button asChild className="w-full">
          <Link href="/">
            Purchase Another Gift Card
          </Link>
        </Button>
      </Card>
    </main>
  );
}