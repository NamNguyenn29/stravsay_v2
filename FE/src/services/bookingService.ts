import api from "@/lib/axios";
import { Booking } from "@/model/Booking";

export const BookingService = {
    createBooking: (data: Booking) => api.post("/Booking", data),
    cancleBooking: (id: string) => api.patch(`/Booking/${id}/cancel`),
    getBookingForUser: () => api.get("/Booking/userbooking"),
    approveBooking: (id: string) => api.patch(`/Booking/${id}/approve`),
    deleteBooking: (id: string) => api.delete(`/Booking/${id}`),
    searchBooking: (filter: string, currentPage: number, pageSize: number) => api.get(`Booking/search?filter=${filter}&currentPage=${currentPage}&pageSize=${pageSize}`),
    getBookings: (currentPage: number, pageSize: number) => api.get(`/Booking?currentPage=${currentPage}&pageSize=${pageSize}`)
}