export interface PaymentMethod {
  paymentMethodID: string;
  name: string;
  code: string; // "VNPAY", "MOMO", "BANK_TRANSFER", ...
  details: string | null;
  status: number;
}
