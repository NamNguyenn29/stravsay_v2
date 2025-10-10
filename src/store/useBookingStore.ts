import { create } from "zustand";

interface BookingState {
    roomType: string | null;
    checkInDate: Date | null;
    checkOutDate: Date | null;
    children: number | null;
    adult: number | null;

    setRoomType: (roomType: string | null) => void;
    setCheckInDate: (date: Date | null) => void;
    setCheckOutDate: (date: Date | null) => void;
    setChildren: (children: number | null) => void;
    setAdult: (adult: number | null) => void;

    resetBooking: () => void;


}

export const useBookingStore = create<BookingState>((set) => ({
    roomType: null,
    checkInDate: null,
    checkOutDate: null,
    children: null,
    adult: null,

    setRoomType: (roomType) => set({ roomType }),
    setCheckInDate: (date) => set({ checkInDate: date }),
    setCheckOutDate: (date) => set({ checkOutDate: date }),
    setChildren: (children) => set({ children }),
    setAdult: (adult) => set({ adult }),

    resetBooking: () => set({
        roomType: null,
        checkInDate: null,
        checkOutDate: null,
        children: null,
        adult: null,
    }),

}));
