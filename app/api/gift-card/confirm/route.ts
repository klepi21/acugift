import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const resend = new Resend(process.env.RESEND_API_KEY);

function generateEmailHTML(code: string, sessions: number) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #FBDAC6 0%, #FFF5E9 100%); padding: 40px; border-radius: 20px;">
      <div style="background: white; padding: 40px; border-radius: 15px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        <img src="https://avgouste.gr/wp-content/uploads/2023/04/logowhite.png" alt="Logo" style="width: 120px; margin-bottom: 20px;">
        <h1 style="color: #8B4513; font-size: 32px; margin-bottom: 10px; font-weight: 300;">Δωροκάρτα Βελονισμού</h1>
        <p style="color: #8B4513; font-size: 18px; margin-bottom: 20px;">Ιατρείο Βελονισμού Ηλέκτρα Αυγουστή Βαρελά</p>
        <div style="width: 80px; height: 2px; background: #8B4513; margin: 0 auto 30px;"></div>
        <p style="color: #8B4513; font-size: 24px; margin-bottom: 30px; font-weight: 300;">
          ${sessions} ${sessions === 1 ? 'Συνεδρία' : 'Συνεδρίες'}
        </p>
        <div style="background: #FFF5E9; padding: 25px; border-radius: 15px; margin: 30px 0;">
          <p style="color: #8B4513; margin-bottom: 10px; font-size: 16px;">Κωδικός Δωροκάρτας</p>
          <p style="font-family: monospace; font-size: 32px; font-weight: bold; color: #8B4513; letter-spacing: 3px; margin: 0;">
            ${code}
          </p>
        </div>
        <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #FBDAC6; text-align: center;">
          <p style="color: #8B4513; font-size: 14px; margin-bottom: 15px;">
            <strong>Επικοινωνία</strong>
          </p>
          <p style="color: #8B4513; font-size: 14px; margin-bottom: 5px;">2310 930 900 | 6981 958 248</p>
          <p style="color: #8B4513; font-size: 14px; margin-bottom: 5px;">Εφέσου 20, Άνω Τούμπα, Θεσσαλονίκη</p>
          <p style="color: #8B4513; font-size: 14px;">Κλείστε ραντεβού μέσω DoctorAnytime</p>
        </div>
      </div>
    </div>
  `;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const code = formData.get('code') as string;
    const file = formData.get('file') as File;
    
    if (!code || !file) {
      console.error('Missing required fields:', { code: !!code, file: !!file });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('Processing gift card:', code);

    // Get gift card data from database
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: giftCard, error: dbError } = await supabase
      .from('gift_cards')
      .select('purchaser_email, sessions, amount')
      .eq('code', code)
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ error: 'Database error: ' + dbError.message }, { status: 500 });
    }

    if (!giftCard) {
      console.error('Gift card not found:', code);
      return NextResponse.json({ error: 'Gift card not found' }, { status: 404 });
    }

    console.log('Found gift card:', giftCard);

    try {
      // Get file data for receipt
      const fileArrayBuffer = await file.arrayBuffer();
      const fileBuffer = Buffer.from(fileArrayBuffer);
      const fileType = file.type;
      const fileName = file.name;

      // Generate email HTML
      const emailHTML = generateEmailHTML(code, giftCard.sessions);

      console.log('Sending email to:', giftCard.purchaser_email);

      // Send email with receipt
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: 'info@avgouste.gr',
        to: giftCard.purchaser_email,
        subject: 'Η πληρωμή σας επιβεβαιώθηκε - Δωροκάρτα',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Η πληρωμή σας επιβεβαιώθηκε!</h2>
            <p>Αγαπητέ/ή πελάτη,</p>
            <p>Η δωροκάρτα σας με κωδικό ${code} έχει ενεργοποιηθεί.</p>
            <p>Θα βρείτε την απόδειξη πληρωμής συνημμένη σε αυτό το email.</p>
            <p>Μπορείτε να την χρησιμοποιήσετε, να την εκτυπώσετε ή να την προωθήσετε.</p>
            
            ${emailHTML}

            <div style="margin-top: 40px; padding: 20px; background: #f8f8f8; border-radius: 10px;">
              <h3 style="color: #8B4513; margin-bottom: 20px;">Επικοινωνία</h3>
              
              <p style="margin-bottom: 15px;">
                <strong>Καλέστε μας</strong><br>
                2310 930 900<br>
                6981 958 248
              </p>

              <p style="margin-bottom: 15px;">
                <strong>Κλείστε Ραντεβού</strong><br>
                Μέσω DoctorAnytime
              </p>

              <p>
                <strong>Τοποθεσία</strong><br>
                Εφέσου 20, Άνω Τούμπα, Θεσσαλονίκη
              </p>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: fileName,
            content: fileBuffer.toString('base64'),
            contentType: fileType
          }
        ]
      });

      if (emailError) {
        console.error('Resend error:', emailError);
        throw new Error(emailError.message);
      }

      console.log('Email sent successfully');

      // Update gift card status
      const { error: updateError } = await supabase
        .from('gift_cards')
        .update({ status: 'active' })
        .eq('code', code);

      if (updateError) {
        console.error('Error updating gift card status:', updateError);
        return NextResponse.json({ error: 'Failed to update gift card status' }, { status: 500 });
      }

      console.log('Gift card status updated successfully');
      return NextResponse.json({ success: true });

    } catch (emailError: any) {
      console.error('Email error:', emailError);
      return NextResponse.json({ error: 'Failed to send email: ' + (emailError?.message || 'Unknown error') }, { status: 500 });
    }

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ 
      error: 'Server error: ' + (error instanceof Error ? error.message : 'Unknown error') 
    }, { status: 500 });
  }
} 