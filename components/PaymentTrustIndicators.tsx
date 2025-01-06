import { Shield, Lock } from 'lucide-react';

export function PaymentTrustIndicators() {
  return (
    <div className="w-full border-t pt-6">
      <div className="flex flex-col items-center space-y-4">
        {/* Security Message */}
        <div className="flex items-center space-x-2 text-[#8B4513]">
          <Lock className="h-5 w-5" />
          <span className="text-sm font-medium">
            Ασφαλείς πληρωμές με κρυπτογράφηση SSL
          </span>
        </div>

        {/* Trust Badge */}
        <div className="flex items-center space-x-2 text-[#8B4513]/80">
          <Shield className="h-5 w-5" />
          <span className="text-xs">
            Πιστοποιημένος συνεργάτης της Viva Payments
          </span>
        </div>
      </div>
    </div>
  );
} 