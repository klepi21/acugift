import { sendEmail } from './sendgrid';
import { generateGiftCardEmail } from './templates';
import type { GiftCard } from '../database/schema';

export async function sendGiftCardEmails(giftCard: GiftCard) {
  // Send to purchaser
  await sendEmail({
    to: giftCard.purchaser_email,
    subject: 'Your Acupuncture Gift Card Purchase',
    html: generateGiftCardEmail(giftCard, true),
  });

  // Send to recipient if email provided
  if (giftCard.recipient_email) {
    await sendEmail({
      to: giftCard.recipient_email,
      subject: 'You\'ve Received an Acupuncture Gift Card!',
      html: generateGiftCardEmail(giftCard, false),
    });
  }
}