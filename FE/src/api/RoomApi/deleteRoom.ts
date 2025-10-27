import { ApiResponse } from "@/model/ApiResponse";

export async function deleteRoom(id: string): Promise<ApiResponse<string>> {
    try {
        const res = await fetch(`https://localhost:7020/api/Room/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) throw new Error("Failed to delete room");
        return await res.json();
    } catch (err) {
        console.error("Error deleting room:", err);
        return {
            totalPage: 0,
            currentPage: 0,
            code: "500",
            message: "Error deleting room",
            list: [],
            object: null,
            isSuccess: false,
            string: null,
            int: null,
        };
    }
}
