export interface Payment {           
  bookingID: string;
  paymentMethodID: string;
  amount: number;
  status?: number;
  paidAt?: string | null;
  createdDate?: string;
  providerTransactionRef?: string | null;
  merchantReference?: string | null;
  fee?: number | null;
  responsePayload?: string | null;
  payUrl?: string | null;
  paymentMethodName?: string | null;
}
