import api from "@/lib/axios";

export const BookingService = {
    cancleBooking: (id: string) => api.patch(`/Booking/${id}/cancel`),
    getBookingForUser: () => api.get("/Booking/userbooking"),
    approveBooking: (id: string) => api.patch(`/Booking/${id}/approve`),
    deleteBooking: (id: string) => api.delete(`/Booking/${id}`),
}