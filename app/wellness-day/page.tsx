"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import { Heart, Clock, Euro, CalendarDays, Sparkles, Brain, HeartPulse, Bed, Zap, MapPin, Phone, Calendar } from 'lucide-react';

const formSchema = z.object({
  fullName: z.string().min(3, 'Παρακαλώ συμπληρώστε το ονοματεπώνυμό σας'),
  email: z.string().email('Απαιτείται έγκυρο email'),
  phone: z.string().min(10, 'Απαιτείται έγκυρος αριθμός τηλεφώνου'),
});

interface WellnessDay {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
}

interface WellnessSlot {
  id: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

export default function WellnessDayPage() {
  const [wellnessDay, setWellnessDay] = useState<WellnessDay | null>(null);
  const [slots, setSlots] = useState<WellnessSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
    }
  });

  useEffect(() => {
    loadWellnessDay();
  }, []);

  const loadWellnessDay = async () => {
    const supabase = createClient();
    
    // Get the next wellness day
    const { data: dayData } = await supabase
      .from('wellness_days')
      .select('*')
      .gte('date', new Date().toISOString())
      .order('date')
      .limit(1)
      .single();

    if (dayData) {
      setWellnessDay(dayData);
      
      // Get available slots
      const { data: slotsData } = await supabase
        .from('wellness_slots')
        .select('*')
        .eq('wellness_day_id', dayData.id)
        .order('start_time');

      if (slotsData) {
        setSlots(slotsData);
      }
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!selectedSlot) {
      alert('Παρακαλώ επιλέξτε ώρα');
      return;
    }

    try {
      setIsLoading(true);
      const supabase = createClient();

      // Create booking
      const { error: bookingError } = await supabase
        .from('wellness_bookings')
        .insert([
          {
            slot_id: selectedSlot,
            full_name: data.fullName,
            email: data.email,
            phone: data.phone
          }
        ]);

      if (bookingError) throw bookingError;

      // Update slot status
      const { error: slotError } = await supabase
        .from('wellness_slots')
        .update({ is_booked: true })
        .eq('id', selectedSlot);

      if (slotError) throw slotError;

      // Send confirmation email
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: data.email,
          subject: 'Επιβεβαίωση Κράτησης - Wellness Open Day',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #8B4513;">Η κράτησή σας επιβεβαιώθηκε!</h1>
              <p>Αγαπητέ/ή ${data.fullName},</p>
              <p>Σας ευχαριστούμε για την κράτησή σας στο Wellness Open Day.</p>
              <div style="background: #FFF5E9; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h2 style="color: #8B4513;">Στοιχεία Κράτησης</h2>
                <p><strong>Ημερομηνία:</strong> ${format(new Date(wellnessDay!.date), 'd MMMM yyyy', { locale: el })}</p>
                <p><strong>Ώρα:</strong> ${format(new Date('1970-01-01T' + slots.find(s => s.id === selectedSlot)?.start_time), 'HH:mm')}</p>
                <p><strong>Κόστος:</strong> 10€ (Πληρωμή στο ιατρείο)</p>
              </div>
              <p>Σας περιμένουμε στο ιατρείο μας!</p>
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #FBDAC6;">
                <p><strong>Διεύθυνση:</strong> Εφέσου 20, Άνω Τούμπα, Θεσσαλονίκη</p>
                <p><strong>Τηλέφωνο:</strong> 2310 930 900 | 6981 958 248</p>
              </div>
            </div>
          `
        })
      });

      if (!response.ok) throw new Error('Failed to send email');

      alert('Η κράτησή σας ολοκληρώθηκε! Θα λάβετε email επιβεβαίωσης.');
      window.location.reload();

    } catch (error) {
      console.error('Booking error:', error);
      alert('Υπήρξε ένα πρόβλημα με την κράτηση. Παρακαλώ προσπαθήστε ξανά.');
    } finally {
      setIsLoading(false);
    }
  };

  const allSlotsBooked = slots.every(slot => slot.is_booked);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FBDAC6] to-white py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-none shadow-xl rounded-2xl overflow-hidden">
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FBDAC6]/20 rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#8B4513]/10 rounded-full translate-y-12 -translate-x-12" />
            
            <div className="text-center space-y-6 mb-12 relative">
              <h1 className="text-4xl md:text-5xl font-bold text-[#8B4513] tracking-tight">
                Wellness Open Day
              </h1>
              <p className="text-lg text-[#8B4513]/80 max-w-2xl mx-auto leading-relaxed">
                Γνωρίστε τον βελονισμό σε μια ειδική ημέρα γνωριμίας. Μια μοναδική ευκαιρία να εξοικειωθείτε με τη θεραπεία και να ανακαλύψετε τα οφέλη της
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mb-12 relative">
              <div className="space-y-6">
                <div className="bg-white/50 rounded-xl p-6 backdrop-blur-sm transform hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-4 text-[#8B4513]">
                    <Clock className="h-8 w-8" />
                    <div>
                      <h3 className="font-semibold">Διάρκεια Συνεδρίας</h3>
                      <p className="text-[#8B4513]/80">25λεπτη συνεδρία γνωριμίας</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/50 rounded-xl p-6 backdrop-blur-sm transform hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-4 text-[#8B4513]">
                    <Euro className="h-8 w-8" />
                    <div>
                      <h3 className="font-semibold">Κόστος</h3>
                      <p className="text-[#8B4513]/80">Μόνο 10€</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/50 rounded-xl p-6 backdrop-blur-sm transform hover:scale-105 transition-transform duration-300">
                  <div className="flex items-start gap-4 text-[#8B4513]">
                    <Heart className="h-8 w-8 shrink-0" />
                    <div>
                      <h3 className="font-semibold">Εξατομικευμένη Εμπειρία</h3>
                      <p className="text-[#8B4513]/80">
                        Προσωπική συνεδρία βελονισμού για χαλάρωση και ευεξία
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#8B4513]/5 p-8 rounded-2xl backdrop-blur-sm">
                <h2 className="text-2xl font-semibold text-[#8B4513] mb-6">
                  Τι να Περιμένετε
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="bg-[#8B4513]/10 p-2 rounded-lg">
                      <span className="text-[#8B4513] font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#8B4513]">Προσωπική Συνάντηση</h4>
                      <p className="text-[#8B4513]/80 text-sm">Γνωριμία με την Ιατρό</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-[#8B4513]/10 p-2 rounded-lg">
                      <span className="text-[#8B4513] font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#8B4513]">Αξιολόγηση</h4>
                      <p className="text-[#8B4513]/80 text-sm">Κατανόηση των αναγκών σας</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-[#8B4513]/10 p-2 rounded-lg">
                      <span className="text-[#8B4513] font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#8B4513]">Θεραπεία</h4>
                      <p className="text-[#8B4513]/80 text-sm">Εισαγωγή στη μέθοδο του βελονισμού</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {!wellnessDay ? (
              <div className="max-w-2xl mx-auto">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg shadow-sm">
                  <p className="text-[#8B4513] mb-2 font-medium">
                    Δεν υπάρχουν προγραμματισμένες ημέρες αυτή τη στιγμή.
                  </p>
                  <p className="text-[#8B4513]/80 text-sm">
                    Εγγραφείτε παρακάτω για να ενημερωθείτε πρώτοι για την επόμενη διαθέσιμη ημερομηνία!
                  </p>
                </div>
                <NotificationSignup />
              </div>
            ) : allSlotsBooked ? (
              <div className="text-center space-y-6">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-auto max-w-xl rounded-r-lg shadow-sm">
                  <p className="text-[#8B4513]">
                    Όλες οι διαθέσιμες ώρες έχουν κλειστεί για αυτή την ημέρα.
                  </p>
                </div>
                <NotificationSignup />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-semibold text-[#8B4513] mb-4">
                    Επιλέξτε Ώρα
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    {slots.map((slot) => (
                      <Button
                        key={slot.id}
                        variant={selectedSlot === slot.id ? "default" : "outline"}
                        className={`${
                          slot.is_booked 
                            ? "opacity-50 cursor-not-allowed" 
                            : "hover:bg-[#8B4513] hover:text-white"
                        } ${
                          selectedSlot === slot.id 
                            ? "bg-[#8B4513] text-white" 
                            : "text-[#8B4513]"
                        }`}
                        disabled={slot.is_booked}
                        onClick={() => setSelectedSlot(slot.id)}
                      >
                        {format(new Date('1970-01-01T' + slot.start_time), 'HH:mm')}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-[#8B4513] mb-4">
                    Στοιχεία Κράτησης
                  </h2>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ονοματεπώνυμο</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Τηλέφωνο</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full bg-[#8B4513] hover:bg-[#6d3610] text-white"
                        disabled={isLoading || !selectedSlot}
                      >
                        {isLoading ? "Επεξεργασία..." : "Ολοκλήρωση Κράτησης"}
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            )}
          </div>
        </Card>

       

        <Card className="p-8 bg-white/80 backdrop-blur-sm border-none shadow-xl rounded-2xl">
          <h2 className="text-2xl font-semibold text-[#8B4513] mb-8 text-center">
            Οφέλη Βελονισμού
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white/50 p-6 rounded-xl backdrop-blur-sm transform hover:scale-105 transition-transform duration-300 text-center space-y-3">
              <Brain className="h-10 w-10 text-[#8B4513] mx-auto" />
              <p className="text-[#8B4513] font-medium">Μείωση Στρες</p>
            </div>
            <div className="bg-white/50 p-6 rounded-xl backdrop-blur-sm transform hover:scale-105 transition-transform duration-300 text-center space-y-3">
              <HeartPulse className="h-10 w-10 text-[#8B4513] mx-auto" />
              <p className="text-[#8B4513] font-medium">Ανακούφιση από Πόνους</p>
            </div>
            <div className="bg-white/50 p-6 rounded-xl backdrop-blur-sm transform hover:scale-105 transition-transform duration-300 text-center space-y-3">
              <Bed className="h-10 w-10 text-[#8B4513] mx-auto" />
              <p className="text-[#8B4513] font-medium">Καλύτερος Ύπνος</p>
            </div>
            <div className="bg-white/50 p-6 rounded-xl backdrop-blur-sm transform hover:scale-105 transition-transform duration-300 text-center space-y-3">
              <Zap className="h-10 w-10 text-[#8B4513] mx-auto" />
              <p className="text-[#8B4513] font-medium">Αύξηση Ενέργειας</p>
            </div>
          </div>
        </Card>

        <Card className="p-8 bg-white/80 backdrop-blur-sm border-none shadow-xl rounded-2xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[#8B4513]">
                <MapPin className="h-6 w-6 shrink-0" />
                <div>
                  <h3 className="font-semibold">Διεύθυνση</h3>
                  <p className="text-[#8B4513]/80">Εφέσου 20, Άνω Τούμπα</p>
                  <p className="text-[#8B4513]/80">Θεσσαλονίκη</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[#8B4513]">
                <Phone className="h-6 w-6 shrink-0" />
                <div>
                  <h3 className="font-semibold">Τηλέφωνα Επικοινωνίας</h3>
                  <p className="text-[#8B4513]/80">2310 930 900</p>
                  <p className="text-[#8B4513]/80">6981 958 248</p>
                </div>
              </div>
            </div>

            
          </div>
        </Card>
      </div>
    </main>
  );
}

function NotificationSignup() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsLoading(true);
      const supabase = createClient();

      const { error } = await supabase
        .from('wellness_notifications')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') { // Unique violation
          alert('Το email σας είναι ήδη καταχωρημένο στη λίστα μας.');
        } else {
          throw error;
        }
      } else {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Υπήρξε ένα πρόβλημα. Παρακαλώ προσπαθήστε ξανά.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-4 max-w-xl mx-auto mt-8">
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <p className="text-[#8B4513]">
            Ευχαριστούμε! Θα σας ενημερώσουμε για το επόμενο Wellness Open Day.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4 max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-semibold text-[#8B4513]">
        Μείνετε Ενημερωμένοι
      </h2>
      <p className="text-[#8B4513]/80">
        Εγγραφείτε για να ενημερωθείτε για το επόμενο Wellness Open Day
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="Το email σας"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
        />
        <Button 
          type="submit" 
          className="bg-[#8B4513] hover:bg-[#6d3610] text-white"
          disabled={isLoading}
        >
          {isLoading ? "Επεξεργασία..." : "Εγγραφή"}
        </Button>
      </form>
    </div>
  );
} 