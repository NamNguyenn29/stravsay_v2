import { axiosInstance } from "../axiosConfig";

export const cancelPayment = async (paymentId: string) => {
  const res = await axiosInstance.put(`/payment/cancel/${paymentId}`);
  return res.data;
};
