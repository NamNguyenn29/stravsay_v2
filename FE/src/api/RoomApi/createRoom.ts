import { ApiResponse } from "@/model/ApiResponse";
import { RoomRequest } from "@/model/RoomRequest";
export async function createRoom(roomRequest: Partial<RoomRequest>): Promise<ApiResponse<RoomRequest>> {
    try {
        const res = await fetch("https://localhost:7020/api/Room", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(roomRequest),
        });
        console.log(res);
        if (!res.ok) throw new Error("Failed to create room");
        return await res.json();

    } catch (err) {
        console.error("Error creating room:", err);
        return {
            totalPage: 0,
            currentPage: 0,
            code: "500",
            message: "Error creating room",
            list: [],
            object: null,
            isSuccess: false,
            string: null,
            int: null,
        };
    }
}