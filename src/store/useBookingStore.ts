import { create } from "zustand";
import { Room } from "@/model/Room";
import dayjs from "dayjs";
interface BookingState {
    roomType: string | null;
    checkInDate: string | null;
    checkOutDate: string | null;
    noChildren: number | null;
    noAdult: number | null;
    room: Room | null;

    setRoomType: (roomType: string | null) => void;
    setCheckInDate: (date: string | null) => void;
    setCheckOutDate: (date: string | null) => void;
    setChildren: (children: number | null) => void;
    setAdult: (adult: number | null) => void;
    setRoom: (room: Room | null) => void;
    resetBooking: () => void;


}

export const useBookingStore = create<BookingState>((set) => ({
    roomType: null,
    checkInDate: dayjs().format('YYYY-MM-DD'),
    checkOutDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    noChildren: null,
    noAdult: null,
    room: null,

    setRoomType: (roomType) => set({ roomType }),
    setCheckInDate: (date) => set({ checkInDate: date }),
    setCheckOutDate: (date) => set({ checkOutDate: date }),
    setChildren: (children) => set({ noChildren: children }),
    setAdult: (adult) => set({ noAdult: adult }),
    setRoom: (room) => set({ room: room }),

    resetBooking: () => set({
        roomType: null,
        checkInDate: null,
        checkOutDate: null,
        noChildren: null,
        noAdult: null,
        room: null,
    }),

}));
