import { User } from "@/model/User";

export async function getUserById(userId: string): Promise<User | null> {
    try {
        const res = await fetch(`http://localhost:5199/api/User/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        return await res.json();
    } catch (err) {
        console.error("Error fetching user:", err);
        return null;
    }
}
