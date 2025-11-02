import { ApiResponse } from "@/model/ApiResponse";
import { Request } from "@/model/Request";
export async function getRequests(): Promise<ApiResponse<Request>> {
    try {
        const res = await fetch("https://localhost:7020/api/SupportRequest", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!res.ok) throw new Error("Failed to fetch requests");
        return await res.json();

    } catch (err) {
        console.error("Error fetching requests:", err)
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