import { ApiResponse } from "@/model/ApiResponse";
import { LoginModel } from "@/model/LoginModel";
export async function loginUser(loginModel: Partial<LoginModel>): Promise<ApiResponse<string>> {
    try {
        const res = await fetch("https://localhost:7020/api/Auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginModel),
        });
        if (!res.ok) throw new Error("Failed to create user");
        return await res.json();

    } catch (err) {
        console.error("Error creating user:", err);
        return {
            totalPage: 0,
            currentPage: 0,
            totalElement: 0,
            pageSize: 0,
            code: "500",
            message: "Error fetching user",
            list: [],
            object: null,
            isSuccess: null,
            string: null,
            int: null,
        };
    }
}