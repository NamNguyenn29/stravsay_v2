import { ApiResponse } from "@/model/ApiResponse";
import { User } from "@/model/User";
export async function getUsers(currentPage: number, pageSize: number): Promise<ApiResponse<User>> {
    try {
        const res = await fetch(`https://localhost:7020/api/User?currentPage=${currentPage}&pageSize=${pageSize}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) throw new Error("Failed to fetch users");
        return await res.json();
    } catch (err) {
        console.error("Error fetching users:", err);
        return {
            totalPage: 0,
            currentPage: 0,
            totalElement: 0,
            pageSize: 0,
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
