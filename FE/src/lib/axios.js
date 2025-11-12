import axios from "axios";
import Router from "next/router";
const api = axios.create({
    baseURL: "https://localhost:7020/api",
    headers: {
        "Content-Type": "application/json",
    },
});


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            console.log("Token expired, redirect to login");
            document.cookie = "CURRENT_USER=; path=/; max-age=0";
            Router.push("/login");

        }
        return Promise.reject(error);
    }
);


export default api;



// import axios from "axios";

// const axiosClient = axios.create({
//     baseURL: "https://localhost:7020", // chỉnh base của bạn
//     withCredentials: true,             // gửi kèm cookies HttpOnly
// });

// // Flag tránh việc lặp vô hạn
// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//     failedQueue.forEach(p => {
//         if (error) p.reject(error);
//         else p.resolve(token);
//     });

//     failedQueue = [];
// };

// axiosClient.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         // Nếu không phải lỗi 401 → trả về lỗi
//         if (error.response.status !== 401) {
//             return Promise.reject(error);
//         }

//         // Nếu đã refresh rồi thì xếp request này vào hàng chờ
//         if (isRefreshing) {
//             return new Promise((resolve, reject) => {
//                 failedQueue.push({ resolve, reject });
//             })
//                 .then(() => axiosClient(originalRequest))
//                 .catch((err) => Promise.reject(err));
//         }

//         // Chưa refresh → refresh
//         isRefreshing = true;

//         try {
//             const res = await axios.post(
//                 "/auth/refresh",
//                 {},
//                 { withCredentials: true }
//             );

//             processQueue(null);
//             return axiosClient(originalRequest);
//         } catch (err) {
//             processQueue(err, null);
//             return Promise.reject(err);
//         } finally {
//             isRefreshing = false;
//         }
//     }
// );

// export default axiosClient;
