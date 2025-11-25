import api from "@/lib/axios";
import { ApiResponse } from "@/model/ApiResponse";
import { Payment } from "@/model/Payment";
import { PaymentMethod } from "@/model/PaymentMethod";
import { PaymentResponse } from "@/model/PaymentResponse";

export const paymentServices = {
  createPayment: (data: Payment) => api.post("/Payment/create", data),
  cancelPayment: (paymentId: string) => api.put(`/Payment/cancel/${paymentId}`),
  getPaymentById: (paymentId: string) =>
    api.get<ApiResponse<PaymentResponse>>(`/Payment/${paymentId}`),
  getPaymentMethods: () => api.get<PaymentMethod[]>(`/Payment/methods`),
};
