"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GiftCard {
  id: string;
  code: string;
  sessions: number;
  amount: number;
  purchaser_email: string;
  purchaser_phone: string;
  purchaser_name: string;
  recipient_email: string | null;
  status: string;
  created_at: string;
}

export default function AdminGiftCards() {
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedGiftCard, setSelectedGiftCard] = useState<GiftCard | null>(null);
  const [emailTarget, setEmailTarget] = useState<'buyer' | 'recipient' | ''>('');

  const authenticate = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('isAdminAuthenticated', 'true');
    } else {
      alert('Λάθος κωδικός');
    }
  };

  useEffect(() => {
    const isAuth = localStorage.getItem('isAdminAuthenticated') === 'true';
    setIsAuthenticated(isAuth);

    if (isAuth) {
      loadGiftCards();
    }
  }, []);

  const loadGiftCards = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('gift_cards')
      .select('id, code, sessions, amount, purchaser_email, purchaser_phone, purchaser_name, recipient_email, status, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading gift cards:', error);
      return;
    }

    setGiftCards(data || []);
  };

  const confirmPayment = async (giftCard: GiftCard) => {
    if (!selectedFile) {
      alert('Παρακαλώ επιλέξτε το τιμολόγιο');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('code', giftCard.code);
      formData.append('file', selectedFile);

      const response = await fetch('/api/gift-card/confirm', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to confirm payment');
      }

      await loadGiftCards();
      setSelectedFile(null);
      alert('Η πληρωμή επιβεβαιώθηκε και στάλθηκε το τιμολόγιο');
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert(`Υπήρξε ένα πρόβλημα: ${error instanceof Error ? error.message : 'Παρακαλώ προσπαθήστε ξανά'}`);
    }
  };

  const deleteGiftCard = async (giftCard: GiftCard) => {
    try {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('gift_cards')
        .delete()
        .eq('id', giftCard.id)
        .select();

      if (error) {
        console.error('Supabase delete error:', error);
        return;
      }

      console.log('Deleted data:', data);
      setGiftCards(currentCards => currentCards.filter(c => c.id !== giftCard.id));
      
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const sendGiftCard = async (giftCard: GiftCard) => {
    if (!emailTarget) {
      alert('Παρακαλώ επιλέξτε παραλήπτη');
      return;
    }

    const emailTo = emailTarget === 'recipient' && giftCard.recipient_email 
      ? giftCard.recipient_email 
      : giftCard.purchaser_email;

    try {
      const response = await fetch('/api/gift-card/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          giftCardId: giftCard.id,
          email: emailTo,
        }),
      });

      if (!response.ok) throw new Error('Failed to send gift card');

      alert('Η δωροκάρτα στάλθηκε επιτυχώς');
      setEmailTarget('');
    } catch (error) {
      console.error('Error sending gift card:', error);
      alert('Υπήρξε ένα πρόβλημα κατά την αποστολή');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FBDAC6] to-white py-12 px-4">
        <Card className="max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-[#8B4513] mb-4">Admin Login</h1>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />
          <Button onClick={authenticate} className="w-full">
            Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBDAC6] to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-[#8B4513] mb-8">Διαχείριση Δωροκαρτών</h1>
        
        <div className="space-y-6">
          {giftCards.map((card) => (
            <Card key={card.id} className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h2 className="font-bold text-[#8B4513]">Στοιχεία Δωροκάρτας</h2>
                  <p>Κωδικός: {card.code}</p>
                  <p>Συνεδρίες: {card.sessions}</p>
                  <p>Ποσό: {card.amount}€</p>
                  <p>Κατάσταση: {card.status}</p>
                  <p>Ημερομηνία: {new Date(card.created_at).toLocaleDateString('el')}</p>
                </div>
                <div>
                  <h2 className="font-bold text-[#8B4513]">Στοιχεία Επικοινωνίας</h2>
                  <p>Ονοματεπώνυμο: {card.purchaser_name}</p>
                  <p>Email: {card.purchaser_email}</p>
                  <p>Τηλέφωνο: {card.purchaser_phone}</p>
                  {card.recipient_email && <p>Email Παραλήπτη: {card.recipient_email}</p>}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4">
                {card.status === 'pending_payment' && (
                  <>
                    <Input
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <Button 
                      onClick={() => confirmPayment(card)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Επιβεβαίωση Πληρωμής
                    </Button>
                  </>
                )}

                {card.status === 'active' && (
                  <div className="flex items-center gap-2">
                    <Select onValueChange={(value) => setEmailTarget(value as 'buyer' | 'recipient')}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Επιλέξτε παραλήπτη" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buyer">Αγοραστής</SelectItem>
                        {card.recipient_email && (
                          <SelectItem value="recipient">Παραλήπτης</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={() => sendGiftCard(card)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Αποστολή Δωροκάρτας
                    </Button>
                  </div>
                )}

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      Διαγραφή
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle>
                      <AlertDialogDescription>
                        Η ενέργεια αυτή δεν μπορεί να αναιρεθεί. Η δωροκάρτα θα διαγραφεί μόνιμα.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Άκυρο</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteGiftCard(card)}>
                        Διαγραφή
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 