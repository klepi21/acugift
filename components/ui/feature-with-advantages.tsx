import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NotificationSignup } from "@/components/NotificationSignup";

interface FeatureProps {
  showEmailSignup: boolean;
}

function Feature({ showEmailSignup }: FeatureProps) {
  return (
    <div className="w-full py-12">
      <div className="container mx-auto">
        <div className="flex gap-4 flex-col items-start">
          <div>
            <Badge className="bg-[#8B4513] text-white">Μόνο για το Wellness Open Day</Badge>
          </div>
          <div className="flex gap-4 flex-col">
            <h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular text-[#8B4513]">
              Wellness Open Day
            </h2>
            <p className="text-lg max-w-xl lg:max-w-xl leading-relaxed tracking-tight text-[#8B4513]/80">
              Μια μοναδική ευκαιρία να γνωρίσετε τα οφέλη του βελονισμού με μόνο 10€. Οι θέσεις είναι περιορισμένες - κλείστε τώρα τη θέση σας!
            </p>
          </div>

          {showEmailSignup && (
            <div className="w-full max-w-md">
              <NotificationSignup />
            </div>
          )}

          <div className="flex gap-10 pt-12 flex-col w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-row gap-4 items-start">
                <Check className="w-5 h-5 mt-1 text-[#8B4513]" />
                <div className="flex flex-col gap-1">
                  <p className="text-[#8B4513] font-medium">25λεπτη Συνεδρία</p>
                  <p className="text-[#8B4513]/80 text-sm">
                    Ατομική συνεδρία γνωριμίας με το βελονισμό
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-4 items-start">
                <Check className="w-5 h-5 mt-1 text-[#8B4513]" />
                <div className="flex flex-col gap-1">
                  <p className="text-[#8B4513] font-medium">Μόνο 10€</p>
                  <p className="text-[#8B4513]/80 text-sm">
                    Ειδική τιμή για το Wellness Open Day
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-4 items-start">
                <Check className="w-5 h-5 mt-1 text-[#8B4513]" />
                <div className="flex flex-col gap-1">
                  <p className="text-[#8B4513] font-medium">Περιορισμένες Θέσεις</p>
                  <p className="text-[#8B4513]/80 text-sm">
                    Κλείστε έγκαιρα τη θέση σας
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-4 items-start">
                <Check className="w-5 h-5 mt-1 text-[#8B4513]" />
                <div className="flex flex-col gap-1">
                  <p className="text-[#8B4513] font-medium">Προσωπική Συμβουλευτική</p>
                  <p className="text-[#8B4513]/80 text-sm">
                    Εξατομικευμένες συμβουλές για τις ανάγκες σας
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-4 items-start">
                <Check className="w-5 h-5 mt-1 text-[#8B4513]" />
                <div className="flex flex-col gap-1">
                  <p className="text-[#8B4513] font-medium">Άνετος Χώρος</p>
                  <p className="text-[#8B4513]/80 text-sm">
                    Σε ένα ήρεμο και φιλικό περιβάλλον
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-4 items-start">
                <Check className="w-5 h-5 mt-1 text-[#8B4513]" />
                <div className="flex flex-col gap-1">
                  <p className="text-[#8B4513] font-medium">Εύκολη Πρόσβαση</p>
                  <p className="text-[#8B4513]/80 text-sm">
                    Στην καρδιά της Άνω Τούμπας
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Feature }; 