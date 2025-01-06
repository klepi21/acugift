import { NextResponse } from 'next/server';
import { updateGiftCardStatus } from '@/lib/database/gift-cards';
import { sendGiftCardEmails } from '@/lib/email/notifications';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId, eventType, transactionId, orderCode } = body;

    // Verify the payment status
    if (eventType !== 'payment.success') {
      return NextResponse.json({ success: true });
    }

    // Find the gift card by the order reference
    const { data: giftCard, error } = await supabase
      .from('gift_cards')
      .select('*')
      .eq('status', 'available')
      .ilike('code', `%${orderCode}%`)
      .single();

    if (error || !giftCard) {
      throw new Error('Gift card not found');
    }

    // Update gift card status
    await updateGiftCardStatus(giftCard.code, 'active', transactionId);

    // Send emails
    await sendGiftCardEmails(giftCard);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}