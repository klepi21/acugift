import { CURRENCY } from '@/lib/constants';
import Image from 'next/image';

interface CardContentProps {
  sessions: number;
  price: number;
  code?: string;
}

export function CardContent({ sessions, price, code }: CardContentProps) {
  return (
    <>
      <div className="relative w-full mb-6">
        <Image 
          src="https://avgouste.gr/wp-content/uploads/2023/04/logowhite.png"
          alt="Avgouste Logo"
          width={180}
          height={60}
          className="mx-auto"
        />
      </div>

      <div className="text-center mb-4">
        <span className="text-[#8B4513] font-medium bg-white/50 px-4 py-1 rounded-full text-sm">
          Δωροκάρτα
        </span>
      </div>

      <div className="bg-white/30 backdrop-blur-sm rounded-xl p-6 space-y-4 relative z-10">
        <div className="text-center">
          <div className="text-4xl font-bold text-[#8B4513] mb-2">
            {sessions}
          </div>
          <div className="text-lg font-medium text-[#8B4513]">
            {sessions === 1 ? 'Συνεδρία' : 'Συνεδρίες'}
          </div>
        </div>

        {code && (
          <div className="mt-6 p-4 bg-white/50 rounded-lg text-center">
            <p className="text-sm text-[#8B4513] mb-2">Κωδικός Εξαργύρωσης</p>
            <p className="text-2xl font-mono font-bold tracking-wider text-[#8B4513] bg-white/50 py-2 rounded-md">
              {code}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 text-center space-y-3">
        <div className="text-[#8B4513] italic font-medium px-4">
          "Ευχομαι καλές γιορτές και χαρούμενο το νέο έτος με υγεία και αγάπη"
        </div>
      </div>
    </>
  );
}