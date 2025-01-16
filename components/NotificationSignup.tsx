"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function NotificationSignup() {
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

      if (error) throw error;

      setIsSubmitted(true);
      setEmail('');
    } catch (error) {
      console.error('Error:', error);
      alert('Υπήρξε ένα πρόβλημα. Παρακαλώ προσπαθήστε ξανά.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
        <p className="text-green-700">
          Ευχαριστούμε! Θα σας ενημερώσουμε μόλις είναι διαθέσιμη η επόμενη ημερομηνία.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        <Input
          type="email"
          placeholder="Το email σας"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-white/50 border-[#8B4513]/20 focus:border-[#8B4513] focus:ring-[#8B4513]"
          required
        />
        <Button 
          type="submit"
          className="bg-[#8B4513] hover:bg-[#6d3610] text-white"
          disabled={isLoading}
        >
          {isLoading ? "Επεξεργασία..." : "Εγγραφή"}
        </Button>
      </div>
    </form>
  );
} 