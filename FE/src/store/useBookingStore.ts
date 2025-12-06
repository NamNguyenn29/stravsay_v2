import { create } from "zustand";
import { Room } from "@/model/Room";
import dayjs from "dayjs";
import { RoomType } from "@/model/RoomType";

interface BookingState {
    roomType: RoomType | null;
    checkInDate: string;
    checkOutDate: string;
    noChildren: number;
    noAdult: number;
    room: Room | null;

    totalAmount: number;
    discountAmount: number;
    discountCode: string;
    
    setTotalAmount: (amount: number) => void;
    setDiscountAmount: (amount: number) => void;
    setDiscountCode: (code: string) => void;

    setRoomType: (roomType: RoomType | null) => void;
    setCheckInDate: (date: string) => void;
    setCheckOutDate: (date: string) => void;
    setChildren: (children: number) => void;
    setAdult: (adult: number) => void;
    setRoom: (room: Room | null) => void;
    resetBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
    checkInDate: dayjs().hour(14).minute(0).second(0).format("YYYY-MM-DDTHH:mm:ss"),
    checkOutDate: dayjs().add(1, "day").hour(12).minute(0).second(0).format("YYYY-MM-DDTHH:mm:ss"),
    noAdult: 2,
    noChildren: 0,
    roomType: null,
    room: null,

    totalAmount: 0,
    discountAmount: 0,
    discountCode: "",
    
    setTotalAmount: (amount) => set({ totalAmount: amount }),
    setDiscountAmount: (amount) => set({ discountAmount: amount }),
    setDiscountCode: (code) => set({ discountCode: code }),

    setRoomType: (roomType) => set({ roomType }),
    setCheckInDate: (date) => set({ checkInDate: date }),
    setCheckOutDate: (date) => set({ checkOutDate: date }),
    setChildren: (children) => set({ noChildren: children }),
    setAdult: (adult) => set({ noAdult: adult }),
    setRoom: (room) => set({ room }),

    resetBooking: () =>
        set({
            roomType: null,
            checkInDate: dayjs().hour(14).minute(0).second(0).format("YYYY-MM-DD HH:mm:ss"),
            checkOutDate: dayjs().add(1, "day").hour(12).minute(0).second(0).format("YYYY-MM-DD HH:mm:ss"),
            noAdult: 2,
            noChildren: 0,
            room: null,
            totalAmount: 0,
            discountAmount: 0,
            discountCode: "",
        }),
}));