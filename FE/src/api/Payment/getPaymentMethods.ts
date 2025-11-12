import { axiosInstance } from "../axiosConfig";

export const getPaymentMethods = async () => {
  const res = await axiosInstance.get("/payment/methods");
  return res.data; // backend trả ApiResponse<List<PaymentMethodDTO>>
};
