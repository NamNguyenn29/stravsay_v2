import { ElegantBookings } from "@/components/user/UserBooking";
import { Suspense } from "react";
export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ElegantBookings />
        </Suspense>
    );
}
