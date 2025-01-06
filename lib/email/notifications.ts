import { Resend } from 'resend';
import { generateGiftCardEmail } from './templates';
import type { GiftCard } from '../database/schema';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendGiftCardEmails(giftCard: GiftCard) {
  // Send to purchaser
  await resend.emails.send({
    from: 'info@avgouste.gr',
    to: giftCard.purchaser_email,
    subject: 'Your Acupuncture Gift Card Purchase',
    html: generateGiftCardEmail(giftCard, true),
  });

  // Send to recipient if email provided
  if (giftCard.recipient_email) {
    await resend.emails.send({
      from: 'info@avgouste.gr',
      to: giftCard.recipient_email,
      subject: 'You\'ve Received an Acupuncture Gift Card!',
      html: generateGiftCardEmail(giftCard, false),
    });
  }
}