import api from "@/lib/axios";
import { ChangePasswordModel } from "@/model/ChangePassword";
import { ResetpasswordModel } from "@/model/ResetPasswordModel";
export const userService = {
    deleteUser: (id: string) => api.delete(`/User/${id}`),
    searchUser: (filter: string, currentPage: number, pageSize: number) => api.get(`User/search?filter=${filter}&currentPage=${currentPage}&pageSize=${pageSize}`),
    changePassword: (changePasswordModel: ChangePasswordModel) => api.post("User/changepassword", changePasswordModel),
    forgotPassword: (email: string) => api.post("/User/forgotpassword", email),
    validateResetToken: (email: string, token: string) => api.get(`/User/checkToken?email=${email}&token=${token}`),
    resetPassword: (resetPasswordModel: ResetpasswordModel) => api.post("/User/resetpassword", resetPasswordModel),
}