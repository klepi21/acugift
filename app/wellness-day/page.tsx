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
import { Feature } from '@/components/ui/feature-with-advantages';

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
  const [selectedSlot, setSelectedSlot] = useState<WellnessSlot | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchWellnessDay = async () => {
      const supabase = createClient();
      const { data: wellnessDays, error: wellnessDayError } = await supabase
        .from('wellness_days')
        .select('*')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(1);

      if (wellnessDayError) {
        console.error('Error fetching wellness day:', wellnessDayError);
        return;
      }

      if (wellnessDays && wellnessDays.length > 0) {
        setWellnessDay(wellnessDays[0]);

        const { data: slotsData, error: slotsError } = await supabase
          .from('wellness_slots')
          .select('*')
          .eq('wellness_day_id', wellnessDays[0].id)
          .order('start_time', { ascending: true });

        if (slotsError) {
          console.error('Error fetching slots:', slotsError);
          return;
        }

        if (slotsData) {
          setSlots(slotsData);
        }
      }
    };

    fetchWellnessDay();
  }, []);

  useEffect(() => {
    if (!selectedSlot) {
      form.reset();
    }
  }, [selectedSlot, form]);

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
            slot_id: selectedSlot.id,
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
        .eq('id', selectedSlot.id);

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
                <p><strong>Ώρα:</strong> ${format(new Date(`2000-01-01T${selectedSlot.start_time}`), 'HH:mm')}</p>
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

  if (!wellnessDay) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#FBDAC6] to-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <Feature showEmailSignup={true} />

          <Card className="p-6 md:p-8 bg-white/80 backdrop-blur-sm border-none shadow-xl rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[#8B4513]">
                  <MapPin className="h-6 w-6 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-base md:text-lg">Διεύθυνση</h3>
                    <p className="text-[#8B4513]/80 text-sm md:text-base">Εφέσου 20, Άνω Τούμπα</p>
                    <p className="text-[#8B4513]/80 text-sm md:text-base">Θεσσαλονίκη</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[#8B4513]">
                  <Phone className="h-6 w-6 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-base md:text-lg">Τηλέφωνα Επικοινωνίας</h3>
                    <p className="text-[#8B4513]/80 text-sm md:text-base">2310 930 900</p>
                    <p className="text-[#8B4513]/80 text-sm md:text-base">6981 958 248</p>
                  </div>
                </div>
              </div>

            </div>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FBDAC6] to-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#8B4513] mb-4">
            Μια μοναδική ευκαιρία να γνωρίσετε τα οφέλη του βελονισμού με μόνο 10€
          </h2>
          <p className="text-[#8B4513]/80">
            Οι θέσεις είναι περιορισμένες - συμπληρώστε το email σας για να ενημερωθείτε άμεσα για την επόμενη διαθέσιμη ημερομηνία!
          </p>
        </div>

        <Card className="p-6 md:p-8 bg-white/80 backdrop-blur-sm border-none shadow-xl rounded-2xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Date and Time Slots */}
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-[#8B4513] mb-4">
                Διαθέσιμες Ώρες - {format(new Date(wellnessDay.date), 'dd MMMM yyyy', { locale: el })}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {slots.map((slot) => (
                  <Button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot)}
                    disabled={slot.is_booked}
                    variant={selectedSlot?.id === slot.id ? 'default' : 'outline'}
                    className={`w-full text-sm md:text-base py-2 md:py-3 ${
                      slot.is_booked
                        ? 'bg-gray-100 text-gray-400'
                        : selectedSlot?.id === slot.id
                        ? 'bg-[#8B4513] text-white hover:bg-[#6d3610]'
                        : 'text-[#8B4513] hover:bg-[#8B4513] hover:text-white'
                    }`}
                  >
                    {format(new Date(`2000-01-01T${slot.start_time}`), 'HH:mm')}
                  </Button>
                ))}
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <div>
              {selectedSlot && !selectedSlot.is_booked ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#8B4513]">Ονοματεπώνυμο</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-white/50 border-[#8B4513]/20" />
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
                          <FormLabel className="text-[#8B4513]">Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" className="bg-white/50 border-[#8B4513]/20" />
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
                          <FormLabel className="text-[#8B4513]">Τηλέφωνο</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-white/50 border-[#8B4513]/20" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-[#8B4513] hover:bg-[#6d3610] text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Επεξεργασία...' : 'Κράτηση'}
                    </Button>
                  </form>
                </Form>
              ) : (
                <div className="h-full flex items-center justify-center text-[#8B4513]">
                  <p className="text-center">Παρακαλώ επιλέξτε διαθέσιμη ώρα</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Features section moved below the booking card */}
        <Feature showEmailSignup={false} />

        {/* Contact information card */}
        <Card className="p-6 md:p-8 bg-white/80 backdrop-blur-sm border-none shadow-xl rounded-2xl mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[#8B4513]">
                <MapPin className="h-6 w-6 shrink-0" />
                <div>
                  <h3 className="font-semibold text-base md:text-lg">Διεύθυνση</h3>
                  <p className="text-[#8B4513]/80 text-sm md:text-base">Εφέσου 20, Άνω Τούμπα</p>
                  <p className="text-[#8B4513]/80 text-sm md:text-base">Θεσσαλονίκη</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[#8B4513]">
                <Phone className="h-6 w-6 shrink-0" />
                <div>
                  <h3 className="font-semibold text-base md:text-lg">Τηλέφωνα Επικοινωνίας</h3>
                  <p className="text-[#8B4513]/80 text-sm md:text-base">2310 930 900</p>
                  <p className="text-[#8B4513]/80 text-sm md:text-base">6981 958 248</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
} 