export interface PaymentResponse {
  paymentID: string;
  bookingID: string;
  paymentMethodID: string;
  amount: number;
  status: number;
  createdDate: string;
  paidAt: string | null;
  responsePayload: string | null;
  payUrl: string | null;
}