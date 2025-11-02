'use client';
import { useBookingStore } from "../../../../store/useBookingStore";
import "antd/dist/reset.css";
import MyBooking from "@/components/user/MyBooking";
import { useEffect, useState } from "react";
import { Room } from "@/model/Room";
export default function BookingPaymentLayout({ children }: { children: React.ReactNode }) {
    const [datedif, setDatedif] = useState<number>(0);
    const {
        checkInDate,
        checkOutDate,
        noAdult,
        noChildren,
        room,
    } = useBookingStore();

    useEffect(() => {
        if (checkInDate && checkOutDate) {
            const start = new Date(checkInDate);
            const end = new Date(checkOutDate);

            // Chỉ lấy ngày, bỏ giờ
            const startDateOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
            const endDateOnly = new Date(end.getFullYear(), end.getMonth(), end.getDate());

            const diffDays = (endDateOnly.getTime() - startDateOnly.getTime()) / (1000 * 60 * 60 * 24);
            setDatedif(diffDays);
        } else {
            setDatedif(0);
        }
    }, [checkInDate, checkOutDate]);
    return (
        <div>
            <div className="bg-[rgb(250,247,245)] mx-auto container py-5 ">

                <div className="grid grid-cols-12 container mx-auto py-20 px-20 bg-[rgb(250,247,245)] gap-10">
                    <div className="col-span-9 space-y-10">{children} </div>
                    <div className="col-span-3">
                        <div className="sticky top-5">
                            <MyBooking
                                datedif={datedif}
                                room={room as Room}
                                start={new Date(checkInDate as string)}
                                end={new Date(checkOutDate as string)}
                                guest={(noAdult as number) + (noChildren as number)}
                            />
                        </div>
                    </div>
                </div>


            </div>
            /   </div>
    )
}