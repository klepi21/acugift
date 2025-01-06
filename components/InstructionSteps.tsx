import { GiftIcon, ClipboardList, BanknoteIcon } from 'lucide-react';
import Image from 'next/image';

export function InstructionSteps() {
  return (
    <div className="w-full max-w-4xl mx-auto mt-12 p-8 bg-white/50 rounded-xl backdrop-blur-sm">
      <h3 className="text-2xl font-semibold text-center text-[#8B4513] mb-8">
        Πώς λειτουργεί
      </h3>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <ClipboardList className="h-12 w-12 text-[#8B4513]" />
          </div>
          <h4 className="font-medium text-[#8B4513]">Βήμα 1</h4>
          <p className="text-sm text-[#8B4513]/80">
            Επιλέξτε τον αριθμό συνεδριών και συμπληρώστε τα στοιχεία σας
          </p>
        </div>

        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <BanknoteIcon className="h-12 w-12 text-[#8B4513]" />
          </div>
          <h4 className="font-medium text-[#8B4513]">Βήμα 2</h4>
          <div className="text-sm text-[#8B4513]/80 space-y-2">
            <p>
              Ολοκληρώστε την πληρωμή με τραπεζική κατάθεση ή μέσω
            </p>
            <div className="flex items-center justify-center gap-2">
              <span>IRIS</span>
              <Image 
                src="https://upload.wikimedia.org/wikipedia/el/9/96/Logo_iris_hor_new.png"
                alt="IRIS Logo"
                width={50}
                height={20}
                className="object-contain"
                unoptimized
              />
            </div>
            <p>
              και θα λάβετε το τιμολόγιο και τη δωροκάρτα σας μετά την επιβεβαίωση
            </p>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <GiftIcon className="h-12 w-12 text-[#8B4513]" />
          </div>
          <h4 className="font-medium text-[#8B4513]">Βήμα 3</h4>
          <p className="text-sm text-[#8B4513]/80">
            Προωθήστε το email ή εκτυπώστε τη δωροκάρτα για να τη χαρίσετε
          </p>
        </div>
      </div>
    </div>
  );
} 