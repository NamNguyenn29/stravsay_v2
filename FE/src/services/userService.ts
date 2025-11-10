import api from "@/lib/axios";
import { ChangePasswordModel } from "@/model/ChangePassword";

export const userService = {
    deleteUser: (id: string) => api.delete(`/User/${id}`),
    searchUser: (filter: string, currentPage: number, pageSize: number) => api.get(`User/search?filter=${filter}&currentPage=${currentPage}&pageSize=${pageSize}`),
    changePassword: (changePasswordModel: ChangePasswordModel) => api.post("User/changepassword", changePasswordModel),
    forgotPassword: (email: string) => api.post("/User/forgotpassword", email)
}