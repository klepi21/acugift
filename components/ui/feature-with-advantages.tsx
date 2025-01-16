import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NotificationSignup } from "@/components/NotificationSignup";

function Feature() {
  return (
    <div className="w-full py-12">
      <div className="container mx-auto">
        <div className="flex gap-4 flex-col items-start">
          <div>
            <Badge className="bg-[#8B4513] text-white">Περιορισμένες Θέσεις</Badge>
          </div>
          <div className="flex gap-4 flex-col">
            <h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular text-[#8B4513]">
              Wellness Open Day
            </h2>
            <p className="text-lg max-w-xl lg:max-w-xl leading-relaxed tracking-tight text-[#8B4513]/80">
              Μια μοναδική ευκαιρία να γνωρίσετε τα οφέλη του βελονισμού. Οι θέσεις είναι περιορισμένες - εγγραφείτε τώρα για να ενημερωθείτε πρώτοι για την επόμενη διαθέσιμη ημερομηνία!
            </p>
          </div>

          <div className="w-full max-w-md">
            <NotificationSignup />
          </div>

          <div className="flex gap-10 pt-12 flex-col w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-row gap-4 items-start">
                <Check className="w-5 h-5 mt-1 text-[#8B4513]" />
                <div className="flex flex-col gap-1">
                  <p className="text-[#8B4513] font-medium">25λεπτη Συνεδρία</p>
                  <p className="text-[#8B4513]/80 text-sm">
                    Εξατομικευμένη συνεδρία γνωριμίας με το βελονισμό
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-4 items-start">
                <Check className="w-5 h-5 mt-1 text-[#8B4513]" />
                <div className="flex flex-col gap-1">
                  <p className="text-[#8B4513] font-medium">Προσιτή Τιμή</p>
                  <p className="text-[#8B4513]/80 text-sm">
                    Μόνο 10€ για μια ολοκληρωμένη εμπειρία βελονισμού
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-4 items-start">
                <Check className="w-5 h-5 mt-1 text-[#8B4513]" />
                <div className="flex flex-col gap-1">
                  <p className="text-[#8B4513] font-medium">Εξειδικευμένη Φροντίδα</p>
                  <p className="text-[#8B4513]/80 text-sm">
                    Από έμπειρη ιατρό με εξειδίκευση στο βελονισμό
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
                  <p className="text-[#8B4513] font-medium">Σύγχρονες Εγκαταστάσεις</p>
                  <p className="text-[#8B4513]/80 text-sm">
                    Σε ένα άνετο και φιλόξενο περιβάλλον
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