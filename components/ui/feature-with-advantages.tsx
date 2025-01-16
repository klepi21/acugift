import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NotificationSignup } from "@/components/NotificationSignup";

interface FeatureProps {
  showEmailSignup: boolean;
}

function Feature({ showEmailSignup }: FeatureProps) {
  return (
    <div className="w-full py-6 md:py-12">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex gap-6 md:gap-8 flex-col items-start">
          <div className="w-full flex flex-col items-center md:items-start text-center md:text-left">
            <Badge className="bg-[#8B4513] text-white text-sm md:text-base mb-4">Μόνο για το Wellness Open Day</Badge>
            <h2 className="text-2xl md:text-3xl lg:text-5xl tracking-tighter font-regular text-[#8B4513] mb-4">
              Wellness Open Day
            </h2>
            <p className="text-base md:text-lg max-w-xl leading-relaxed tracking-tight text-[#8B4513]/80">
              Μια μοναδική ευκαιρία να γνωρίσετε τα οφέλη του βελονισμού με μόνο 10€. Οι θέσεις είναι περιορισμένες - συμπληρώστε το email σας για να ενημερωθείτε άμεσα για την επόμενη διαθέσιμη ημερομηνία!
            </p>
          </div>

          {showEmailSignup && (
            <div className="w-full max-w-md mx-auto md:mx-0">
              <NotificationSignup />
            </div>
          )}

          <div className="w-full pt-8 md:pt-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              <div className="flex flex-row gap-3 md:gap-4 items-start bg-white/40 p-4 rounded-lg hover:bg-white/60 transition-colors">
                <Check className="w-5 h-5 mt-1 text-[#8B4513] shrink-0" />
                <div className="flex flex-col gap-1">
                  <p className="text-[#8B4513] font-medium text-base md:text-lg">25λεπτη Συνεδρία</p>
                  <p className="text-[#8B4513]/80 text-sm md:text-base">
                    Ατομική συνεδρία γνωριμίας με το βελονισμό
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-3 md:gap-4 items-start bg-white/40 p-4 rounded-lg hover:bg-white/60 transition-colors">
                <Check className="w-5 h-5 mt-1 text-[#8B4513] shrink-0" />
                <div className="flex flex-col gap-1">
                  <p className="text-[#8B4513] font-medium text-base md:text-lg">Μόνο 10€</p>
                  <p className="text-[#8B4513]/80 text-sm md:text-base">
                    Ειδική τιμή για το Wellness Open Day
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-3 md:gap-4 items-start bg-white/40 p-4 rounded-lg hover:bg-white/60 transition-colors">
                <Check className="w-5 h-5 mt-1 text-[#8B4513] shrink-0" />
                <div className="flex flex-col gap-1">
                  <p className="text-[#8B4513] font-medium text-base md:text-lg">Περιορισμένες Θέσεις</p>
                  <p className="text-[#8B4513]/80 text-sm md:text-base">
                    Κλείστε έγκαιρα τη θέση σας
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-3 md:gap-4 items-start bg-white/40 p-4 rounded-lg hover:bg-white/60 transition-colors">
                <Check className="w-5 h-5 mt-1 text-[#8B4513] shrink-0" />
                <div className="flex flex-col gap-1">
                  <p className="text-[#8B4513] font-medium text-base md:text-lg">Προσωπική Συμβουλευτική</p>
                  <p className="text-[#8B4513]/80 text-sm md:text-base">
                    Εξατομικευμένες συμβουλές για τις ανάγκες σας
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-3 md:gap-4 items-start bg-white/40 p-4 rounded-lg hover:bg-white/60 transition-colors">
                <Check className="w-5 h-5 mt-1 text-[#8B4513] shrink-0" />
                <div className="flex flex-col gap-1">
                  <p className="text-[#8B4513] font-medium text-base md:text-lg">Άνετος Χώρος</p>
                  <p className="text-[#8B4513]/80 text-sm md:text-base">
                    Σε ένα ήρεμο και φιλικό περιβάλλον
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-3 md:gap-4 items-start bg-white/40 p-4 rounded-lg hover:bg-white/60 transition-colors">
                <Check className="w-5 h-5 mt-1 text-[#8B4513] shrink-0" />
                <div className="flex flex-col gap-1">
                  <p className="text-[#8B4513] font-medium text-base md:text-lg">Εύκολη Πρόσβαση</p>
                  <p className="text-[#8B4513]/80 text-sm md:text-base">
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