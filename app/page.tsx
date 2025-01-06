"use client";

import { useState } from "react";
import { GiftCard } from "@/components/gift-card/GiftCard";
import { SessionSelector } from "@/components/session-selector/SessionSelector";
import { PurchaseForm } from "@/components/PurchaseForm";
import { InstructionSteps } from "@/components/InstructionSteps";
import { BenefitsSection } from "@/components/BenefitsSection";
import { calculatePrice } from "@/lib/pricing";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [sessions, setSessions] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [purchaserName, setPurchaserName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [code, setCode] = useState('');
  const amount = calculatePrice(sessions);

  const price = calculatePrice(sessions);

  const confirmPayment = async (code: string, file: File) => {
    try {
      setIsLoading(true);
      
      const formData = new FormData();
      formData.append('code', code);
      formData.append('file', file);

      const response = await fetch('/api/gift-card/confirm', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to confirm payment');
      }

      alert('Η πληρωμή επιβεβαιώθηκε! Θα λάβετε email με την απόδειξη.');
      window.location.href = '/';

    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('Σφάλμα κατά την επιβεβαίωση. Παρακαλώ δοκιμάστε ξανά.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FBDAC6] to-white py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <GiftCard sessions={sessions} price={price} />
          </div>

          <Card className="p-6 space-y-8">
            <SessionSelector sessions={sessions} onChange={setSessions} />
            <PurchaseForm sessions={sessions} price={price} />
          </Card>
        </div>

        <BenefitsSection />
        
        <InstructionSteps />


      </div>
    </main>
  );
}

function HowItWorks() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#8B4513] mb-12">
          Πώς Λειτουργεί
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-[#FBDAC6] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-[#8B4513]">1</span>
            </div>
            <h3 className="text-xl font-semibold text-[#8B4513] mb-2">Επιλογή Σνεδριών</h3>
            <p className="text-[#8B4513]">Επιλέξτε τον αριθμό συνεδριών που θέλετε να δωρίσετε</p>
          </div>
          <div className="text-center">
            <div className="bg-[#FBDAC6] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-[#8B4513]">2</span>
            </div>
            <h3 className="text-xl font-semibold text-[#8B4513] mb-2">Τραπεζική Κατάθεση</h3>
            <p className="text-[#8B4513]">Ολοκληρώστε την πληρωμή με κατάθεση στον τραπεζικό λογαριασμό</p>
          </div>
          <div className="text-center">
            <div className="bg-[#FBDAC6] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-[#8B4513]">3</span>
            </div>
            <h3 className="text-xl font-semibold text-[#8B4513] mb-2">Λήψη Δωροκάρτας</h3>
            <p className="text-[#8B4513]">Μετά την επιβεβαίωση της κατάθεσης, θα λάβετε τη δωροκάρτα στο email σας</p>
          </div>
        </div>
      </div>
    </section>
  );
}