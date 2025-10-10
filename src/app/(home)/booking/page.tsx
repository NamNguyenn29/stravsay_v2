'use client';
import { useBookingStore } from "../../../store/useBookingStore";

export default function Booking() {
    const { roomType, checkInDate, checkOutDate, adult, children } =
        useBookingStore();

    return (
        <div>{roomType || "chua chon"}</div>
    );
}