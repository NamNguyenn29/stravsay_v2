import { ApiResponse } from "@/model/ApiResponse";
import { User } from "@/model/User";
export async function getUsers(currentPage: number, pageSize: number): Promise<ApiResponse<User>> {
    try {
        const token = sessionStorage.getItem("accessToken");
        const res = await fetch(`https://localhost:7020/api/User?currentPage=${currentPage}&pageSize=${pageSize}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        if (!res.ok) throw new Error("Failed to fetch users");
        return await res.json();
    } catch (err) {
        console.error("Error creating user:", err);
        return {
            code: "500",
            message: "Error fetching user",
            isSuccess: false,
            list: [],
        } as ApiResponse<User>;
    }
}
