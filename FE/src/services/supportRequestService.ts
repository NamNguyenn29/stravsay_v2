import api from "@/lib/axios";

export const supportService = {
    responseRequest: (id: string, response: string) => api.put(`/SupportRequest/${id}`, response),
}