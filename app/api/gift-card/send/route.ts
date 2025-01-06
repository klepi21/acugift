import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { sendConfirmationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { giftCardId, email } = await request.json();

    const supabase = createClient();
    
    // Get gift card details
    const { data: giftCard, error } = await supabase
      .from('gift_cards')
      .select('*')
      .eq('id', giftCardId)
      .single();

    if (error || !giftCard) throw new Error('Gift card not found');

    // Send gift card email
    await sendConfirmationEmail({
      to: email,
      subject: 'Η Δωροκάρτα σας',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B4513;">Η Δωροκάρτα σας</h1>
          <p>Κωδικός: ${giftCard.code}</p>
          <p>Συνεδρίες: ${giftCard.sessions}</p>
          <p>Αξία: ${giftCard.amount}€</p>
          <p>Μπορείτε να χρησιμοποιήσετε τη δωροκάρτα στο επόμενο ραντεβού σας.</p>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send gift card error:', error);
    return NextResponse.json(
      { error: 'Failed to send gift card' },
      { status: 500 }
    );
  }
} 