"use client";

export default function BookingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <div className="text-center text-5xl text-white bg-black font-semibold p-10">
                Booking Room
            </div>
            {children}
        </div>
    );
}
