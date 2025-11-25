import api from "@/lib/axios";
import { Review } from "@/model/Review";

export const reviewService = {
  getAllReviews: () => api.get("/Review"),
  getReviewById: (id: string) => api.get(`/Review/${id}`),
  getReviewsByRoomId: (roomId: string) => api.get(`/Review/room/${roomId}`),
  getReviewsByUserId: (userId: string) => api.get(`/Review/user/${userId}`),
  getReviewByBookingId: (bookingId: string) => api.get(`/Review/booking/${bookingId}`),
  createReview: (data: Review) => api.post("/Review", data),
  updateReview: (id: string, data: Review) => api.put(`/Review/${id}`, data),
  deleteReview: (id: string) => api.delete(`/Review/${id}`),
  canReview: (bookingId: string) => api.get(`/Review/can-review/${bookingId}`)
};