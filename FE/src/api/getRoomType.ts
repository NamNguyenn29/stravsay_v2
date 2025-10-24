import { ApiResponse } from "@/model/ApiResponse";
import { RoomType } from "@/model/RoomType";

export async function getRoomType(): Promise<ApiResponse<RoomType>> {
    try {
        const res = await fetch("https://localhost:7020/api/RoomType", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!res.ok) throw new Error("Failed to fetch room types");
        return await res.json();
    } catch (err) {
        console.error("Error fetching room types:", err);
        return {
            totalPage: 0,
            currentPage: 0,
            code: "500",
            message: "Error fetching room types",
            list: [],
            object: null,
            isSuccess: null,
            string: null,
            int: null,
        };
    }

}
