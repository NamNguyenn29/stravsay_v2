import { Booking } from "@/model/Booking";
export async function getBookings(): Promise<Booking[]> {
    try {
        const res = await fetch("http://localhost:5199/api/Booking", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!res.ok) throw new Error("Failed to fetch bookings");
        return await res.json();

    } catch (err) {
        console.error("Error fetching bookings:", err);
        return [];
    }
} 