import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import puppeteer from 'puppeteer';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const resend = new Resend(process.env.RESEND_API_KEY);

function generateGiftCardHTML(code: string, sessions: number) {
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

function generatePDFGiftCardHTML(code: string, sessions: number) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Gift Card</title>
      <style>
        @page {
          margin: 0;
          size: A4;
        }
        body {
          margin: 0;
          padding: 40px;
          background: linear-gradient(135deg, #FBDAC6 0%, #FFF5E9 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: Arial, sans-serif;
        }
        .gift-card {
          background: white;
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          text-align: center;
          max-width: 400px;
          width: 100%;
        }
        .logo {
          width: 120px;
          margin-bottom: 20px;
          filter: brightness(0) saturate(100%) invert(31%) sepia(15%) saturate(2193%) hue-rotate(346deg) brightness(92%) contrast(89%);
        }
        .title {
          color: #8B4513;
          font-size: 32px;
          margin-bottom: 10px;
          font-weight: 300;
        }
        .subtitle {
          color: #8B4513;
          font-size: 18px;
          margin-bottom: 20px;
        }
        .divider {
          width: 80px;
          height: 2px;
          background: #8B4513;
          margin: 0 auto 30px;
        }
        .sessions {
          color: #8B4513;
          font-size: 24px;
          margin-bottom: 30px;
          font-weight: 300;
        }
        .code-section {
          background: #FFF5E9;
          padding: 25px;
          border-radius: 15px;
          margin: 30px 0;
        }
        .code-label {
          color: #8B4513;
          margin-bottom: 10px;
          font-size: 16px;
        }
        .code {
          font-family: monospace;
          font-size: 32px;
          font-weight: bold;
          color: #8B4513;
          letter-spacing: 3px;
          margin: 0;
        }
        .contact {
          margin-top: 30px;
          padding-top: 30px;
          border-top: 1px solid #FBDAC6;
          text-align: center;
        }
        .contact p {
          color: #8B4513;
          font-size: 14px;
          margin: 5px 0;
        }
        .contact-title {
          font-weight: bold;
          margin-bottom: 15px;
        }
      </style>
    </head>
    <body>
      <div class="gift-card">
        <img src="https://avgouste.gr/wp-content/uploads/2023/04/logowhite.png" alt="Logo" class="logo">
        <h1 class="title">Δωροκάρτα</h1>
        <p class="subtitle">Ιατρείο Βελονισμού Ηλέκτρα Αυγουστή Βαρελά</p>
        <div class="divider"></div>
        <p class="sessions">${sessions} ${sessions === 1 ? 'Συνεδρία' : 'Συνεδρίες'}</p>
        <div class="code-section">
          <p class="code-label">Κωδικός Δωροκάρτας</p>
          <p class="code">${code}</p>
        </div>
        <div class="contact">
          <p class="contact-title">Επικοινωνία</p>
          <p>2310 930 900 | 6981 958 248</p>
          <p>Εφέσου 20, Άνω Τούμπα, Θεσσαλονίκη</p>
          <p>Κλείστε ραντεβού μέσω DoctorAnytime</p>
        </div>
      </div>
    </body>
    </html>
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

      // Generate gift card HTML for PDF
      const pdfGiftCardHTML = generatePDFGiftCardHTML(code, giftCard.sessions);

      // Launch browser and create PDF
      const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      
      // Enable request interception
      await page.setRequestInterception(true);
      page.on('request', request => {
        if (request.resourceType() === 'image') {
          request.continue();
        } else {
          request.continue();
        }
      });

      await page.setContent(pdfGiftCardHTML, { 
        waitUntil: ['networkidle0', 'load', 'domcontentloaded']
      });
      
      // Wait for logo to load
      await page.waitForSelector('img.logo', { timeout: 5000 });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' }
      });
      await browser.close();

      // Convert PDF buffer to Base64
      const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');

      // Generate gift card HTML for email
      const emailGiftCardHTML = generateGiftCardHTML(code, giftCard.sessions);

      console.log('Sending email to:', giftCard.purchaser_email);

      // Send email with both receipt and gift card
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: 'info@avgouste.gr',
        to: giftCard.purchaser_email,
        subject: 'Η πληρωμή σας επιβεβαιώθηκε - Δωροκάρτα',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Η πληρωμή σας επιβεβαιώθηκε!</h2>
            <p>Αγαπητέ/ή πελάτη,</p>
            <p>Η δωροκάρτα σας με κωδικό ${code} έχει ενεργοποιηθεί.</p>
            <p>Θα βρείτε την απόδειξη πληρωμής και τη δωροκάρτα σας συνημμένα σε αυτό το email.</p>
            <p>Μπορείτε να την χρησιμοποιήσετε, να την εκτυπώσετε ή να την προωθήσετε.</p>
            
            ${emailGiftCardHTML}

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
          },
          {
            filename: `giftcard-${code}.pdf`,
            content: pdfBase64,
            contentType: 'application/pdf'
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