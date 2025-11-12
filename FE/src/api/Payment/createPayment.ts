import { axiosInstance } from "../axiosConfig";

export interface CreatePaymentDTO {
  bookingID: string;
  paymentMethodID: string;
  amount: number;
}

export const createPayment = async (payload: CreatePaymentDTO) => {
  const res = await axiosInstance.post("/payment/create", payload);
  return res.data; // ApiResponse<PaymentDTO>
};
