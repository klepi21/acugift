import { NextResponse } from 'next/server';
import { createPaymentOrder } from '@/lib/payment/viva';
import { createGiftCard, generateUniqueCode } from '@/lib/database/gift-cards';
import { calculatePrice } from '@/lib/pricing';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.email || !body.phone || !body.sessions) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { email, phone, fullName, recipientEmail, sessions, amount } = body;
    const code = await generateUniqueCode();

    const paymentOrder = await createPaymentOrder({
      amount: amount * sessions,
      email,
      phone,
      fullName,
      customerTrns: `Gift Card ${code}`,
    });

    const { data, error: dbError } = await createGiftCard({
      code,
      sessions,
      amount,
      purchaser_email: email,
      purchaser_phone: phone,
      purchaser_name: email.split('@')[0],
      recipient_email: recipientEmail || null,
      status: 'pending_payment',
    });

    return new Response(
      JSON.stringify({
        success: true,
        orderCode: paymentOrder.orderCode,
        checkoutUrl: paymentOrder.checkoutUrl,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Payment creation failed' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}