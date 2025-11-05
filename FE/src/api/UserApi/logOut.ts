import { ApiResponse } from "@/model/ApiResponse";
export async function logOut(): Promise<ApiResponse<string>> {
    try {
        const res = await fetch("https://localhost:7020/api/Auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to create user");
        return await res.json();

    } catch (err) {
        console.error("Error login:", err);
        return {
            code: "500",
            message: "Error fetching user",
            isSuccess: false,
            list: [],
        } as ApiResponse<string>;
    }
}