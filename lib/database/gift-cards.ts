import { createClient } from '@/lib/supabase/client';
import { nanoid } from 'nanoid';

export type GiftCardStatus = 'pending_payment' | 'active' | 'used' | 'expired';

export interface GiftCard {
  id: string;
  code: string;
  sessions: number;
  amount: number;
  purchaser_email: string;
  purchaser_phone: string;
  purchaser_name: string;
  recipient_email?: string;
  status: GiftCardStatus;
  created_at: string;
  updated_at: string;
}

export async function generateUniqueCode(): Promise<string> {
  const supabase = createClient();
  let code: string;
  let isUnique = false;

  // Characters that are easy to read and distinguish
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  while (!isUnique) {
    // Generate 6 characters
    const randomChars = Array.from(
      { length: 6 },
      () => chars[Math.floor(Math.random() * chars.length)]
    );

    // Join all characters without hyphen
    code = randomChars.join('');

    const { data } = await supabase
      .from('gift_cards')
      .select('code')
      .eq('code', code)
      .single();

    if (!data) {
      isUnique = true;
      return code;
    }
  }

  throw new Error('Failed to generate unique code');
}

export async function createGiftCard({
  code,
  sessions,
  amount,
  purchaser_email,
  purchaser_phone,
  purchaser_name,
  recipient_email,
  status,
}: Omit<GiftCard, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('gift_cards')
    .insert([
      {
        code,
        sessions,
        amount,
        purchaser_email,
        purchaser_phone,
        purchaser_name,
        recipient_email,
        status,
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Supabase error:', error);
  }

  return { data, error };
}

export async function getGiftCard(code: string) {
  const supabase = createClient();
  
  return await supabase
    .from('gift_cards')
    .select('*')
    .eq('code', code)
    .single();
}