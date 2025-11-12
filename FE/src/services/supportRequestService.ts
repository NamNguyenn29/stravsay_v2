import api from "@/lib/axios";

export const supportService = {
    responseRequest: (id: string, response: string) => api.put(`/SupportRequest/${id}`, response),
    removeResponse: (id: string) => api.delete(`/SupportRequest/${id}`),
    searchRequest: (filter: string, currentPage: number, pageSize: number) => api.get(`/SupportRequest/search?filter=${filter}&currentPage=${currentPage}&pageSize=${pageSize}`),
}