import api from "@/lib/axios";
import { Payment } from "@/model/Payment";
import { PaymentMethod } from "@/model/PaymentMethod";
import { PaymentResponse } from "@/model/PaymentResponse";

export const paymentServices = {
  createPayment: () => api.post(`/Payment/create`),
  cancelPayment: (paymentId: string) => api.post(`/Payment/${paymentId}/cancel`),
  getPaymentById: (paymentId: string) => api.get<PaymentResponse>(`/Payment/${paymentId}`),
  getPaymentMethods: () => api.get<PaymentMethod[]>(`/Payment/methods`),
};
