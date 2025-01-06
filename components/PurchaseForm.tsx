"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CURRENCY } from '@/lib/constants';

const formSchema = z.object({
  fullName: z.string().min(3, 'Παρακαλώ συμπληρώστε το ονοματεπώνυμό σας'),
  email: z.string().email('Απαιτείται έγκυρο email'),
  phone: z.string().min(10, 'Απαιτείται έγκυρος αριθμός τηλεφώνου'),
  recipientEmail: z.string().email('Απαιτείται έγκυρο email').optional().or(z.literal('')),
});

interface PurchaseFormProps {
  sessions: number;
  price: number;
}

export function PurchaseForm({ sessions, price }: PurchaseFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      recipientEmail: '',
    }
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      
      // Create gift card in database
      const response = await fetch('/api/gift-card/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          sessions,
          amount: price,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create gift card');
      }

      const result = await response.json();
      
      // Redirect to payment instructions with the code from database
      window.location.href = `/payment/instructions?code=${result.code}&amount=${price}&email=${encodeURIComponent(data.email)}${data.recipientEmail ? `&recipientEmail=${encodeURIComponent(data.recipientEmail)}` : ''}`;
    } catch (error) {
      console.error('Error:', error);
      alert('Υπήρξε ένα πρόβλημα. Παρακαλώ προσπαθήστε ξανά.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ονοματεπώνυμο</FormLabel>
              <FormControl>
                <Input placeholder="π.χ. Μαρία Παπαδοπούλου" {...field} />
              </FormControl>
              <FormMessage />
              <p className="text-sm text-muted-foreground">
                * Απαιτείται για την έκδοση της απόδειξης
              </p>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email σας</FormLabel>
              <FormControl>
                <Input placeholder="to.email.sas@example.com" {...field} />
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
                <Input placeholder="69XXXXXXXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recipientEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Παραλήπτη (Προαιρετικό)</FormLabel>
              <FormControl>
                <Input placeholder="email.paralipti@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-2xl font-bold text-center text-[#8B4513] mt-8">
          Σύνολο: {CURRENCY.symbol}{price}
        </div>

        <Button 
          type="submit" 
          className="w-full bg-[#8B4513] hover:bg-[#6d3610] mt-4 text-white" 
          disabled={isLoading}
        >
          {isLoading ? "Επεξεργασία..." : "Προχωρήστε στην Πληρωμή"}
        </Button>
      </form>
    </Form>
  );
}