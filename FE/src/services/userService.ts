import { UpdateUser } from "@/model/UpdateUser";
import api from "@/lib/axios";
import { ChangePasswordModel } from "@/model/ChangePassword";
import { ResetpasswordModel } from "@/model/ResetPasswordModel";
import { RegisterModel } from "@/model/RegisterModel";
import { LoginModel } from "@/model/LoginModel";
export const userService = {
    deleteUser: (id: string) => api.delete(`/User/${id}`),
    searchUser: (filter: string, currentPage: number, pageSize: number) => api.get(`User/search?filter=${filter}&currentPage=${currentPage}&pageSize=${pageSize}`),
    changePassword: (changePasswordModel: ChangePasswordModel) => api.post("User/changepassword", changePasswordModel),
    forgotPassword: (email: string) => api.post("/User/forgotpassword", email),
    validateResetToken: (email: string, token: string) => api.get(`/User/checkToken?email=${email}&token=${token}`),
    resetPassword: (resetPasswordModel: ResetpasswordModel) => api.post("/User/resetpassword", resetPasswordModel),
    updateUser: (updateUser: UpdateUser) => api.put("/User/me", updateUser),
    registerUser: (registerModel: RegisterModel) => api.post("/User/register", registerModel),
    loginUser: (loginModel: LoginModel) => api.post("/Auth/login", loginModel),
    logOut: () => api.post("/Auth/logout"),
    getUserById: (id: string) => api.get(`/User/${id}`),
    getUsers: (currentPage: number, pageSize: number) => api.get(`/User?currentPage=${currentPage}&pageSize=${pageSize}`),
    getMyUser: () => api.get("/User/me")
    // async getMyUser() {
    //     try {
    //         return await api.get("/User/me");
    //     } catch {
    //         return { data: { isSuccess: false } };
    //     }
    // }


}