import { Request } from "@/model/Request";
export async function getRequests(): Promise<Request[]> {
    try {
        const res = await fetch("http://localhost:5199/api/Request", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!res.ok) throw new Error("Failed to fetch requests");
        return await res.json();

    } catch (err) {
        console.error("Error fetching requests:", err)
        return [];
    }
}