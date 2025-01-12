"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format, addMinutes } from 'date-fns';
import { el } from 'date-fns/locale';

interface WellnessDay {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
}

interface WellnessBooking {
  id: string;
  slot_id: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
  slot: {
    start_time: string;
    end_time: string;
  };
}

export default function AdminWellnessDaysPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [wellnessDays, setWellnessDays] = useState<WellnessDay[]>([]);
  const [bookings, setBookings] = useState<WellnessBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem('isAdminAuthenticated') === 'true';
    setIsAuthenticated(isAuth);

    if (isAuth) {
      loadWellnessDays();
    }
  }, []);

  const authenticate = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('isAdminAuthenticated', 'true');
      loadWellnessDays();
    } else {
      alert('Λάθος κωδικός');
    }
  };

  const loadWellnessDays = async () => {
    const supabase = createClient();
    
    const { data } = await supabase
      .from('wellness_days')
      .select('*')
      .order('date', { ascending: false });

    if (data) {
      setWellnessDays(data);
    }
  };

  const loadBookings = async (dayId: string) => {
    const supabase = createClient();
    
    const { data } = await supabase
      .from('wellness_bookings')
      .select(`
        *,
        slot:wellness_slots (
          start_time,
          end_time
        )
      `)
      .eq('slot.wellness_day_id', dayId)
      .order('created_at');

    if (data) {
      setBookings(data);
    }
  };

  const createWellnessDay = async () => {
    if (!date || !startTime || !endTime) {
      alert('Παρακαλώ συμπληρώστε όλα τα πεδία');
      return;
    }

    try {
      setIsLoading(true);

      // Create wellness day using API route
      const response = await fetch('/api/admin/wellness-days/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, start_time: startTime, end_time: endTime })
      });

      if (!response.ok) {
        throw new Error('Failed to create wellness day');
      }

      await loadWellnessDays();
      setDate('');
      setStartTime('');
      setEndTime('');
      alert('Η ημέρα δημιουργήθηκε επιτυχώς');

    } catch (error) {
      console.error('Error creating wellness day:', error);
      alert('Υπήρξε ένα πρόβλημα. Παρακαλώ προσπαθήστε ξανά.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteWellnessDay = async (id: string) => {
    try {
      // Delete wellness day using API route
      const response = await fetch(`/api/admin/wellness-days/delete?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete wellness day');
      }

      await loadWellnessDays();
      setBookings([]);
      alert('Η ημέρα διαγράφηκε επιτυχώς');

    } catch (error) {
      console.error('Error deleting wellness day:', error);
      alert('Υπήρξε ένα πρόβλημα κατά τη διαγραφή');
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
      <div className="max-w-6xl mx-auto space-y-8">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-[#8B4513] mb-4">
            Δημιουργία Νέας Ημέρας
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-[#8B4513] mb-2 block">Ημερομηνία</label>
              <div className="relative">
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-white/50 border-[#8B4513]/20 focus:border-[#8B4513] focus:ring-[#8B4513] rounded-xl"
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[#8B4513] mb-2 block">Ώρα Έναρξης</label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-white/50 border-[#8B4513]/20 focus:border-[#8B4513] focus:ring-[#8B4513] rounded-xl h-10 px-3"
              >
                <option value="">Επιλέξτε</option>
                {Array.from({ length: 48 }, (_, i) => {
                  const hour = Math.floor(i / 2);
                  const minute = i % 2 === 0 ? '00' : '30';
                  const time = `${hour.toString().padStart(2, '0')}:${minute}:00`;
                  return (
                    <option key={time} value={time}>
                      {time.slice(0, 5)}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-[#8B4513] mb-2 block">Ώρα Λήξης</label>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-white/50 border-[#8B4513]/20 focus:border-[#8B4513] focus:ring-[#8B4513] rounded-xl h-10 px-3"
              >
                <option value="">Επιλέξτε</option>
                {Array.from({ length: 48 }, (_, i) => {
                  const hour = Math.floor(i / 2);
                  const minute = i % 2 === 0 ? '00' : '30';
                  const time = `${hour.toString().padStart(2, '0')}:${minute}:00`;
                  return (
                    <option key={time} value={time}>
                      {time.slice(0, 5)}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={createWellnessDay}
                className="w-full bg-[#8B4513] hover:bg-[#6d3610] text-white h-10 rounded-xl transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Επεξεργασία..." : "Δημιουργία"}
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-[#8B4513] mb-4">
              Προγραμματισμένες Ημέρες
            </h2>
            <div className="space-y-4">
              {wellnessDays.map((day) => (
                <div
                  key={day.id}
                  className="flex items-center justify-between p-4 bg-white/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-[#8B4513]">
                      {format(new Date(day.date), 'd MMMM yyyy', { locale: el })}
                    </p>
                    <p className="text-sm text-[#8B4513]/80">
                      {format(new Date(`1970-01-01T${day.start_time}`), 'HH:mm')} - 
                      {format(new Date(`1970-01-01T${day.end_time}`), 'HH:mm')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => loadBookings(day.id)}
                    >
                      Κρατήσεις
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        if (window.confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την ημέρα;')) {
                          deleteWellnessDay(day.id);
                        }
                      }}
                    >
                      Διαγραφή
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-[#8B4513] mb-4">
              Κρατήσεις
            </h2>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 bg-white/50 rounded-lg space-y-2"
                >
                  <div className="flex justify-between">
                    <p className="font-medium text-[#8B4513]">
                      {booking.full_name}
                    </p>
                    <p className="text-[#8B4513]">
                      {format(new Date(`1970-01-01T${booking.slot.start_time}`), 'HH:mm')}
                    </p>
                  </div>
                  <p className="text-sm text-[#8B4513]/80">{booking.email}</p>
                  <p className="text-sm text-[#8B4513]/80">{booking.phone}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 