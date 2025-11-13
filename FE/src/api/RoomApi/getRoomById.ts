import { Room } from "@/model/Room";

export async function getRoomById(roomId: string): Promise<Room | null> {
    try {
        const res = await fetch(`http://localhost:5199/api/Room/${roomId}`, {
            method: "GET",
            credentials: "include", // 👈 cookie JWT
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!res.ok) throw new Error("Failed to fetch room");
        return await res.json();
    } catch (err) {
        console.error("Error fetching room:", err);
        return null;
    }
}

//modified