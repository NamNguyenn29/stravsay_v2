import api from "@/lib/axios";

export const systemlogService = {
    getAllLogs: (currentPage: number, pageSize: number) => 
        api.get(`/SystemLog?currentPage=${currentPage}&pageSize=${pageSize}`),
    
    getUserLogs: (userId: string, currentPage: number, pageSize: number) => 
        api.get(`/SystemLog/user/${userId}?currentPage=${currentPage}&pageSize=${pageSize}`),
    
    deleteLog: (logId: string) => 
        api.delete(`/SystemLog/${logId}`),
}