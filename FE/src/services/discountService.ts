import api from "@/lib/axios";
import { Discount } from "@/model/Discount";

export const discountService = {
    getAllDiscount: () => api.get("/Discount"),
    getDiscountById: (id: string) => api.get(`/Discount/${id}`),
    getDiscountByCode: (discountCode: string) => api.get(`/Discount/code/${discountCode}`),
    validateDiscount: (data: { discountCode: string; minOrderAmount: number }) => 
        api.post(`/Discount/validate`, data),
    createDiscount: (data: Discount) => api.post(`/Discount`, data),
    updateDiscount: (id: string, data: Discount) => api.put(`/Discount/${id}`, data),
    deleteDiscount: (id: string) => api.delete(`/Discount/${id}`),
};