import { ApiResponse } from "@/model/ApiResponse";
import { UpdateUser } from "@/model/UpdateUser";
import { User } from "@/model/User";
export async function updateUser(updateUser: UpdateUser): Promise<ApiResponse<User>> {
    try {
        const res = await fetch("https://localhost:7020/me", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateUser),
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to create user");
        return await res.json();

    } catch (err) {
        console.error("Error update user:", err);
        return {
            code: "500",
            message: "Error update user",
            isSuccess: false,
            list: [],
        } as ApiResponse<User>;
    }
}