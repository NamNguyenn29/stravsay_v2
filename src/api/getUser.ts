import { User } from "@/model/User";
export async function getUsers(): Promise<User[]> {
    try {
        const res = await fetch("http://localhost:5199/api/User", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) throw new Error("Failed to fetch users");
        return await res.json();
    } catch (err) {
        console.error("Error fetching users:", err);
        return [];
    }
}