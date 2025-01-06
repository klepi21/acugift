import { NextResponse } from 'next/server';
import { createGiftCard, generateUniqueCode } from '@/lib/database/gift-cards';
import { sendGiftCardEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, phone, fullName, recipientEmail, sessions, amount } = body;

    if (!email || !phone || !fullName || !sessions || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    try {
      const code = await generateUniqueCode();
      console.log('Generated code:', code);

      const { data, error: dbError } = await createGiftCard({
        code,
        sessions,
        amount,
        purchaser_email: email,
        purchaser_phone: phone,
        purchaser_name: fullName,
        recipient_email: recipientEmail || null,
        status: 'pending_payment',
      });

      if (dbError) {
        console.error('Database error:', dbError);
        return NextResponse.json(
          { error: `Failed to create gift card: ${dbError.message}` },
          { status: 500 }
        );
      }

      if (!data) {
        return NextResponse.json(
          { error: 'No data returned from database' },
          { status: 500 }
        );
      }

      try {
        await sendGiftCardEmail({
          to: email,
          code,
          sessions,
          amount,
          status: 'pending_payment',
          recipientEmail: recipientEmail || undefined,
        });
      } catch (emailError) {
        console.error('Email error:', emailError);
        // Continue even if email fails
      }

      return NextResponse.json({
        success: true,
        code: data.code,
      });
    } catch (innerError) {
      console.error('Inner error:', innerError);
      const errorMessage = innerError instanceof Error ? innerError.message : 'Unknown error';
      return NextResponse.json(
        { error: `Internal error: ${errorMessage}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Request error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 