// import axios from "axios";
// import Router from "next/router";
// const api = axios.create({
//     baseURL: "https://localhost:7020/api",
//     withCredentials: true,
//     headers: {
//         "Content-Type": "application/json",
//     },
// });


// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         if (error.response?.status === 401) {

//             const res = await api.post("/User/refresh");
//             if (res.status === 401) {
//                 document.cookie = "CURRENT_USER=; path=/; max-age=0";

//                 Router.push("/login");
//             }

//         }
//         return Promise.reject(error);
//     }
// );


// export default api;


import axios from "axios";
import { Rss } from "lucide-react";
import Router from "next/router";

const api = axios.create({
    baseURL: "https://localhost:7020/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (originalRequest.url.includes("/Auth/refresh")) {
            return Promise.reject(error);
        }

        // Nếu không phải 401 thì bỏ qua
        if (error.response?.status !== 401) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(() => api(originalRequest));
        }

        isRefreshing = true;

        try {
            await api.post("/Auth/refresh");
            // const res = await api.post("/Auth/refresh");
            // if (res.data.isSuccess && res.data.object) {
            //     // const resGetUser = await GetMyUser();
            //     const resGetUser = await userService.getMyUser();
            //     if (resGetUser.data.isSuccess && resGetUser.data.object) {
            //         const jsonString = JSON.stringify(resGetUser.data.object);

            //         document.cookie = `CURRENT_USER=${encodeURIComponent(jsonString)}; path=/; max-age=${1 * 60 * 60}`;

            //         await new Promise(r => setTimeout(r, 100)); // 
            //     }
            // }
            processQueue(null);
            return api(originalRequest);
        } catch (err) {
            processQueue(err, null);
            // document.cookie = "CURRENT_USER=; path=/; max-age=0";
            // if (typeof window !== "undefined" && window.location.pathname !== "/login") {
            //     Router.push("/login");
            // }
            Router.push("/login");

            return Promise.reject(err);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;
