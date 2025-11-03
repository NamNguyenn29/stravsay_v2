import { ApiResponse } from "@/model/ApiResponse";
import { Booking } from "@/model/Booking";
export async function getBookings(currentPage: number, pageSize: number): Promise<ApiResponse<Booking>> {
    try {
        const token = sessionStorage.getItem("accessToken");

        const res = await fetch(`https://localhost:7020/api/Booking?currentPage=${currentPage}&pageSize=${pageSize}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });
        if (!res.ok) throw new Error("Failed to fetch bookings");
        console.log(res);
        return await res.json();

    } catch (err) {
        console.error("Error get bookings:", err);
        return {
            code: "500",
            message: "Error fetching booking",
            isSuccess: false,
            list: [],
        } as ApiResponse<Booking>;
    }
} 