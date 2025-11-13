import { ApiResponse } from "@/model/ApiResponse";
import { RegisterModel } from "@/model/RegisterModel";
export async function registerUser(registerModel: Partial<RegisterModel>): Promise<ApiResponse<string>> {
    try {
        const res = await fetch("https://localhost:7020/api/User/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registerModel),
        });
        if (!res.ok) throw new Error("Failed to create user");
        return await res.json();

    } catch (err) {
        console.error("Error creating user:", err);
        return {
            code: "500",
            message: "Error fetching user",
            isSuccess: false,
            list: [],
        } as ApiResponse<string>;
    }
}

//modified