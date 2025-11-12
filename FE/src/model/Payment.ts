// DTO gửi đi khi tạo thanh toán
export interface Payment {
  bookingID: string;
  paymentMethodID: string;
  amount: number;
}