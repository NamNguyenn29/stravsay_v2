import { Room } from "@/model/Room";
export async function getRooms(): Promise<Room[]> {
    try {
        const res = await fetch("http://localhost:5199/api/Room", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch rooms");
        return await res.json();
    } catch (err) {
        console.error("Error fetching rooms:", err);
        return [];
    }
}