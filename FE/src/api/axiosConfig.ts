import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7020/api";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: log lỗi response
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);
