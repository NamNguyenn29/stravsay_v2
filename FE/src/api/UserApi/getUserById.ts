
import { ApiResponse } from "@/model/ApiResponse";
import { User } from "@/model/User";
export async function getUserById(id: string): Promise<ApiResponse<User>> {
    try {
        const token = sessionStorage.getItem("accessToken");
        const res = await fetch(`https://localhost:7020/api/User/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });
        if (!res.ok) throw new Error("Failed to get user");
        return await res.json();

    } catch (err) {
        console.error("Error get user:", err);
        return {
            code: "500",
            message: "Error fetching user",
            isSuccess: false,
            list: [],
        } as ApiResponse<User>;
    }
}