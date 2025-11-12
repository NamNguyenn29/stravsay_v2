import api from "@/lib/axios";
import { Service } from "@/model/Service";

export const serviceServices = {
  getAll: () => api.get(`/Service`),
  getById: (id: string) => api.get(`/Service/${id}`)
};
