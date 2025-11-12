import { axiosInstance } from "../axiosConfig";

export const getPaymentById = async (paymentId: string) => {
  const res = await axiosInstance.get(`/payment/${paymentId}`);
  return res.data;
};
