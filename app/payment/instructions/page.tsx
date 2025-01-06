"use client";

import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { createClient } from '@/lib/supabase/client';

export default function PaymentInstructionsPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const amount = searchParams.get('amount');
  const email = searchParams.get('email');
  const recipientEmail = searchParams.get('recipientEmail');
  const purchaserName = searchParams.get('purchaserName');
  const recipientName = searchParams.get('recipientName');

  const [copiedIban, setCopiedIban] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const copyToClipboard = (text: string, type: 'iban' | 'code') => {
    navigator.clipboard.writeText(text);
    if (type === 'iban') {
      setCopiedIban(true);
      setTimeout(() => setCopiedIban(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FBDAC6] to-white py-12 px-4">
      <Card className="max-w-2xl mx-auto p-4 md:p-8 space-y-6">
        <h1 className="text-xl md:text-2xl font-bold text-[#8B4513] text-center">
          Επίλογες Πληρωμής
        </h1>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="bank-transfer">
            <AccordionTrigger className="text-[#8B4513] hover:text-[#8B4513]/90">
              Τραπεζική Κατάθεση
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6">
                <div className="bg-white/50 p-4 rounded-lg">
                  <h2 className="font-semibold text-[#8B4513] mb-3">Στοιχεία Τραπεζικού Λογαριασμού</h2>
                  <div className="space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <span className="text-[#8B4513] font-medium">IBAN:</span>
                      <div className="flex items-center gap-2 w-full md:w-auto">
                        <code className="bg-white px-2 py-1 rounded text-sm md:text-base flex-1 md:flex-none break-all md:break-normal">
                          GR6601107850000078501452540
                        </code>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard('GR6601107850000078501452540', 'iban')}
                          className="shrink-0 text-[#8B4513] hover:text-[#6d3610] hover:bg-white/50"
                        >
                          {copiedIban ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                      <span className="text-[#8B4513] font-medium">Δικαιούχος:</span>
                      <span className="font-medium">ΗΛΕΚΤΡΑ ΑΥΓΟΥΣΤΗ ΒΑΡΕΛΑ</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                      <span className="text-[#8B4513] font-medium">Τράπεζα:</span>
                      <span className="font-medium">ΕΘΝΙΚΗ ΤΡΑΠΕΖΑ</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/50 p-4 rounded-lg">
                  <h2 className="font-semibold text-[#8B4513] mb-3">Στοιχεία Συναλλαγής</h2>
                  <div className="space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                      <span className="text-[#8B4513] font-medium">Ποσό:</span>
                      <span className="font-bold">{amount}€</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <span className="text-[#8B4513] font-medium">Αριθμός Αναφοράς:</span>
                      <div className="flex items-center gap-2">
                        <code className="bg-white px-2 py-1 rounded text-sm md:text-base">{code}</code>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(code || '', 'code')}
                          className="shrink-0"
                        >
                          {copiedCode ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="iris">
            <AccordionTrigger className="text-[#8B4513] hover:text-[#8B4513]/90">
              <div className="flex items-center gap-2">
                <span>Πληρωμή μέσω IRIS</span>
                <Image 
                  src="https://upload.wikimedia.org/wikipedia/el/9/96/Logo_iris_hor_new.png"
                  alt="IRIS Logo"
                  width={60}
                  height={24}
                  className="object-contain"
                  unoptimized
                />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="bg-white/50 p-4 rounded-lg">
                  <h2 className="font-semibold text-[#8B4513] mb-3">Στοιχεία Συναλλαγής</h2>
                  <div className="space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                      <span className="text-[#8B4513] font-medium">Ποσό:</span>
                      <span className="font-bold">{amount}€</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <span className="text-[#8B4513] font-medium">Αριθμός Αναφοράς:</span>
                      <div className="flex items-center gap-2">
                        <code className="bg-white px-2 py-1 rounded text-sm md:text-base">{code}</code>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(code || '', 'code')}
                          className="shrink-0"
                        >
                          {copiedCode ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                      <span className="text-[#8B4513] font-medium">ΑΦΜ για IRIS:</span>
                      <span className="font-medium">156811765</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/50 p-4 rounded-lg">
                  <h2 className="font-semibold text-[#8B4513] mb-3">Οδηγίες</h2>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-[#8B4513]">
                    <li>Ανοίξτε την εφαρμογή e-banking της τράπεζάς σας</li>
                    <li>Επιλέξτε "Αποστολή Χρημάτων μέσω IRIS"</li>
                    <li>Επιλέξτε αναζήτηση με ΑΦΜ</li>
                    <li>Εισάγετε το ΑΦΜ: 156811765</li>
                    <li>Συμπληρώστε το ποσό: {amount}€</li>
                    <li>Στην αιτιολογία συμπληρώστε τον αριθμό αναφοράς: {code}</li>
                    <li>Μετά την επιβεβαίωση της πληρωμής, θα λάβετε τη δωροκάρτα και το τιμολόγιο στο email σας</li>
                  </ol>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <h2 className="font-semibold text-[#8B4513] mb-2">Σημαντικές Πληροφορίες</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-[#8B4513]">
            <li>Παρακαλώ συμπληρώστε τον αριθμό αναφοράς στην αιτιολογία κατάθεσης</li>
            <li>Η δωροκάρτα θα ενεργοποιηθεί μετά την επιβεβαίωση της κατάθεσης</li>
            <li>
              Θα λάβετε τη δωροκάρτα και το τιμολόγιο στο email σας ({email}) μετά την επιβεβαίωση της πληρωμής
          
            </li>
            <li>Μπορείτε να εκτυπώσετε τη δωροκάρτα ή να την προωθήσετε ηλεκτρονικά</li>
            <li>Για οποιαδήποτε απορία επικοινωνήστε μαζί μας στο info@avgouste.gr</li>
          </ul>
        </div>

        <div className="flex justify-center pt-4">
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-[#8B4513] hover:bg-[#6d3610] text-white"
          >
            Επιστροφή στην Αρχική
          </Button>
        </div>
      </Card>
    </main>
  );
} 