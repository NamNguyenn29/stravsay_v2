import api from "@/lib/axios";
import type { Setting } from "@/model/Setting";

export const settingService = {
    getSetting: () => api.get<{ isSuccess: boolean; object: Setting | null; message: string; code: string }>(`/setting`),
    updateSetting: (data: Setting) => api.put<{ isSuccess: boolean; object: Setting | null; message: string; code: string }>(`/setting`, data),
}