import { Resend } from 'resend';
import { generateGiftCardEmail } from './templates';
import type { GiftCard } from '../database/schema';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendGiftCardEmails(giftCard: GiftCard) {
  await resend.emails.send({
    from: 'info@avgouste.gr',
    to: giftCard.purchaser_email,
    subject: 'Your Acupuncture Gift Card Purchase',
    html: generateGiftCardEmail(giftCard, true),
  });
}