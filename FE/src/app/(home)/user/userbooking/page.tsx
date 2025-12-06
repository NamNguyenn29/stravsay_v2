import { Suspense } from "react";
import { Spin } from "antd";
import ElegantBookingsContent from "@/components/user/ElegantBookingsContent";

export default function UserBookingPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" />
            </div>
        }>
            <ElegantBookingsContent />
        </Suspense>
    );
}