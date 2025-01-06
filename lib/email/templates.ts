import { CURRENCY } from '../constants';
import type { GiftCard } from '../database/schema';

export function generateGiftCardEmail(giftCard: GiftCard, isPurchaser: boolean) {
  const total = giftCard.amount * giftCard.sessions;
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #FBDAC6; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h1 style="color: #8B4513; text-align: center;">Ιατρείο Βελονισμού</h1>
        <div style="background: white; padding: 20px; border-radius: 8px; text-align: center;">
          <p style="font-size: 18px; color: #8B4513;">
            ${giftCard.sessions} ${giftCard.sessions === 1 ? 'Session' : 'Sessions'}
          </p>
          <p style="font-size: 24px; font-weight: bold; color: #8B4513;">
            ${CURRENCY.symbol}${total}
          </p>
          <div style="margin-top: 20px; padding: 15px; background: #f8f8f8; border-radius: 6px;">
            <p style="margin: 0; color: #666;">Redemption Code</p>
            <p style="font-size: 24px; font-family: monospace; font-weight: bold; margin: 10px 0; color: #8B4513;">
              ${giftCard.code}
            </p>
          </div>
        </div>
      </div>
      <p style="color: #666; text-align: center;">
        ${isPurchaser 
          ? 'Thank you for your purchase! You can print this email or forward it to the recipient.'
          : 'You have received an Acupuncture Gift Card! Use the code above to redeem your sessions.'}
      </p>
    </div>
  `;
}