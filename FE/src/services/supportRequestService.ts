import api from "@/lib/axios";
import { NewSupportRequest } from "@/model/NewSupportRequest";

export const supportService = {
    responseRequest: (id: string, response: string) => api.put(`/SupportRequest/${id}`, response),
    removeResponse: (id: string) => api.delete(`/SupportRequest/${id}`),
    searchRequest: (filter: string, currentPage: number, pageSize: number) => api.get(`/SupportRequest/search?filter=${filter}&currentPage=${currentPage}&pageSize=${pageSize}`),
    createSupportRequest: (newSupportRequeset: NewSupportRequest) => api.post("/SupportRequest", newSupportRequeset),
    getRequests: (currentPage: number, pageSize: number) => api.get(`/SupportRequest?currentPage=${currentPage}&pageSize=${pageSize}`)
}