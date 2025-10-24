import { ApiResponse } from "@/model/ApiResponse";
import { Booking } from "@/model/Booking";
export async function getBookings(): Promise<ApiResponse<Booking>> {
    try {
        const res = await fetch("https://localhost:7020/api/Booking", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!res.ok) throw new Error("Failed to fetch bookings");
        return await res.json();

    } catch (err) {
        console.error("Error fetching bookings:", err);
        return {
            totalPage: 0,
            currentPage: 0,
            code: "500",
            message: "Error fetching users",
            list: [],
            object: null,
            isSuccess: null,
            string: null,
            int: null,
        };
    }
} 