import { ApiResponse } from "@/model/ApiResponse";
import { RoomRequest } from "@/model/RoomRequest";
import { Room } from "@/model/Room";

export async function updateRoom(id: string, roomData: RoomRequest): Promise<ApiResponse<Room>> {
    try {
        const res = await fetch(`https://localhost:7020/api/Room/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(roomData),
        });

        if (!res.ok) throw new Error("Failed to update room");
        return await res.json();

    } catch (err) {
        console.error("Error updating room:", err);
        return {
            totalPage: 0,
            currentPage: 0,
            code: "500",
            message: "Error updating room",
            list: [],
            object: null,
            isSuccess: false,
            string: null,
            int: null,
        };
    }
}