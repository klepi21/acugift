import type { GiftCard } from '../database/schema';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY!;
const FROM_EMAIL = process.env.FROM_EMAIL!;

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: SendEmailParams) {
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: FROM_EMAIL },
      subject,
      content: [{ type: 'text/html', value: html }],
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send email');
  }
}