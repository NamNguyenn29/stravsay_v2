// src/services/dashboardService.ts
import api from "@/lib/axios";

export const DashboardService = {
  getDashboardData: () => api.get("/Dashboard"),
};