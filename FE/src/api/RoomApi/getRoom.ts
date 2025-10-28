import { ApiResponse } from "@/model/ApiResponse";
import { Room } from "@/model/Room";
export async function getRooms(currentPage: number, itemPerPage: number): Promise<ApiResponse<Room>> {
    try {
        const res = await fetch("https://localhost:7020/api/Room", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!res.ok) throw new Error("Failed to fetch rooms");
        return await res.json();
    } catch (err) {
        console.error("Error fetching rooms:", err);
        return {
            totalPage: 0,
            currentPage: 0,
            totalElement: 0,
            pageSize: 0,
            code: "500",
            message: "Error fetching rooms",
            list: [],
            object: null,
            isSuccess: null,
            string: null,
            int: null,
        };
    }
}