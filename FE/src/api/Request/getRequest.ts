import { ApiResponse } from "@/model/ApiResponse";
import { Request } from "@/model/Request";
export async function getRequests(currentPage: number, pageSize: number): Promise<ApiResponse<Request>> {
    try {
        const res = await fetch(`https://localhost:7020/api/SupportRequest?currentPage=${currentPage}&pageSize=${pageSize}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch requests");
        return await res.json();

    } catch (err) {
        console.error("Error get request:", err);
        return {
            code: "500",
            message: "Error fetching requests",
            isSuccess: false,
            list: [],
        } as ApiResponse<Request>;
    }
}

//modifed