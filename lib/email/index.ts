import { GiftCardStatus } from '@/lib/database/gift-cards';

interface SendGiftCardEmailParams {
  to: string;
  code: string;
  sessions: number;
  amount: number;
  status: GiftCardStatus;
  recipientEmail?: string;
  subject?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    path: string;
  }>;
}

export async function sendGiftCardEmail({
  to,
  code,
  sessions,
  amount,
  status,
  recipientEmail,
}: SendGiftCardEmailParams) {
  const response = await fetch('/api/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to,
      subject: 'Η παραγγελία σας στο Avgouste.gr',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B4513; text-align: center;">Ευχαριστούμε για την παραγγελία σας!</h1>
          
          <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #8B4513;">Στοιχεία Τραπεζικού Λογαριασμού</h2>
            <p><strong>IBAN:</strong> GR1234567890123456789012345</p>
            <p><strong>Δικαιούχος:</strong> ΑΥΓΟΥΣΤΗ ΜΑΡΙΑ</p>
            <p><strong>Τράπεζα:</strong> ΤΡΑΠΕΖΑ ΠΕΙΡΑΙΩΣ</p>
          </div>

          <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #8B4513;">Στοιχεία Συναλλαγής</h2>
            <p><strong>Κωδικός Δωροκάρτας:</strong> ${code}</p>
            <p><strong>Συνεδρίες:</strong> ${sessions}</p>
            <p><strong>Ποσό:</strong> ${amount}€</p>
          </div>

          <div style="background: #FFF9C4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FFB74D;">
            <h2 style="color: #8B4513;">Σημαντικές Πληροφορίες</h2>
            <ul style="color: #8B4513; padding-left: 20px;">
              <li>Παρακαλώ συμπληρώστε τον κωδικό δωροκάρτας (${code}) στην αιτιολογία κατάθεσης</li>
              <li>Η δωροκάρτα θα ενεργοποιηθεί μετά την επιβεβαίωση της κατάθεσης</li>
              <li>${recipientEmail 
                ? `Η δωροκάρτα θα αποσταλεί απευθείας στο email του παραλήπτη (${recipientEmail}) μετά την επιβεβαίωση της πληρωμής`
                : 'Θα λάβετε τη δωροκάρτα στο email σας μετά την επιβεβαίωση της πληρωμής'
              }</li>
              <li>Μπορείτε να εκτυπώσετε τη δωροκάρτα ή να την πρ��ωθήσετε ηλεκτρονικά</li>
              <li>Για οποιαδήποτε απορία επικοινωνήστε μαζί μας στο info@avgouste.gr</li>
            </ul>
          </div>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send email');
  }

  return response.json();
}

interface SendConfirmationEmailParams {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    path: string;
  }>;
}

export async function sendConfirmationEmail(params: SendConfirmationEmailParams) {
  const response = await fetch('/api/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) throw new Error('Failed to send email');
  return response.json();
} 