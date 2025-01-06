export interface GiftCardData {
  sessions: number;
  code?: string;
  price: number;
  purchaseDate?: Date;
}

export interface PurchaseFormData {
  fullName: string;
  email: string;
  phone: string;
  recipientEmail?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}