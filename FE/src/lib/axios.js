import axios from "axios";

// Base URL của backend ASP.NET Core
const api = axios.create({
    baseURL: "https://localhost:7020/api", // backend URL
    withCredentials: true, // gửi cookie httpOnly
    headers: {
        "Content-Type": "application/json",
    },
});
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            console.log("Token expired, redirect to login");
            router.push("/login");
        }
        return Promise.reject(error);
    }
);


export default api;