export type GiftCard = {
  id: string;
  code: string;
  sessions: number;
  amount: number;
  purchaser_email: string;
  purchaser_phone: string;
  recipient_email?: string;
  status: 'available' | 'pending' | 'used';
  payment_id?: string;
  created_at: string;
  used_at?: string;
};

export type Database = {
  public: {
    Tables: {
      gift_cards: {
        Row: GiftCard;
        Insert: Omit<GiftCard, 'id' | 'created_at'>;
        Update: Partial<Omit<GiftCard, 'id'>>;
      };
    };
  };
};