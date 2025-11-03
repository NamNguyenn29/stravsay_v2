
import { ApiResponse } from "@/model/ApiResponse";
import { Booking } from "@/model/Booking";
export async function GetBookingForUser(): Promise<ApiResponse<Booking>> {
    try {

        const token = sessionStorage.getItem("accessToken");
        const res = await fetch(`https://localhost:7020/userbooking`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });
        if (!res.ok) throw new Error("Failed to get booking for user");
        return await res.json();

    } catch (err) {
        console.error("Error get booking for user:", err);
        return {
            totalPage: 0,
            currentPage: 0,
            totalElement: 0,
            pageSize: 0,
            code: "500",
            message: "Error fetching booking for user",
            list: [],
            object: null,
            isSuccess: null,
            string: null,
            int: null,
        };
    }
}