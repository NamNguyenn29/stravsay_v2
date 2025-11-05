
import { ApiResponse } from "@/model/ApiResponse";
import { User } from "@/model/User";
export async function GetMyUser(): Promise<ApiResponse<User>> {
    try {
        const res = await fetch(`https://localhost:7020/api/User/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include"
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