import { ApiResponse } from "@/model/ApiResponse";
import { Room } from "@/model/Room";
export async function getRooms(currentPage: number, pageSize: number): Promise<ApiResponse<Room>> {
    try {
        const token = sessionStorage.getItem("accessToken");
        const res = await fetch(`https://localhost:7020/api/Booking?currentPage=${currentPage}&pageSize=${pageSize}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        if (!res.ok) throw new Error("Failed to fetch rooms");
        return await res.json();
    } catch (err) {
        console.error("Error get rooms:", err);
        return {
            code: "500",
            message: "Error fetching room",
            isSuccess: false,
            list: [],
        } as ApiResponse<Room>;
    }
}
