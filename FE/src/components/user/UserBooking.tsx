"use client";

import { motion } from "framer-motion";
import { Input, Button, message, Spin, Modal } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Booking } from "@/model/Booking";
import dayjs from "dayjs";
import { BookingService } from "@/services/bookingService";

export function ElegantBookings() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [modal, modalContextHolder] = Modal.useModal();
    const [messageApi, contexHolder] = message.useMessage();

    useEffect(() => {
        const payment = searchParams.get('payment');
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (payment === 'success') {
            messageApi.success('Thanh toán thành công! Đặt phòng của bạn đã được xác nhận 🎉', 5);
            router.replace('/user/userbooking', { scroll: false });
        } else if (payment === 'failed') {
            messageApi.error(`Thanh toán thất bại! Mã lỗi: ${code || 'N/A'}`, 5);
            router.replace('/user/userbooking', { scroll: false });
        } else if (error) {
            messageApi.error('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại!', 5);
            router.replace('/user/userbooking', { scroll: false });
        }
    }, [searchParams, router, messageApi]);
    const loadBooking = async () => {
        try {
            setLoading(true);
            const res = await BookingService.getBookingForUser();
            setBookings(res.data.list);
        } catch (err) {
            message.error("Không thể tải danh sách booking.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadBooking();
    }, []);
    
    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return dayjs(dateString).format("DD/MM/YYYY : HH:00");
    };
    const handleCancel = (id: string) => {
        modal.confirm({
            title: "Are you sure you want to cancel this booking?",
            content: "This action cannot be undone.",
            centered: true,
            okText: "Yes, cancel it",
            cancelText: "Cancel",
            okType: "danger",
            className: "custom-delete-confirm",

            async onOk() {
                try {
                    const res = await BookingService.cancleBooking(id);
                    if (res.data.isSuccess) {
                        messageApi.success(res.data.message);
                        // Reload lại danh sách
                        loadBooking();
                    } else {
                        messageApi.error(res.data.message);
                    }
                } catch (error) {
                    messageApi.error("Có lỗi khi hủy booking");
                }
            },
        });
    }


    return (
        <>
            {modalContextHolder}
            {contexHolder}
            <div className="relative min-h-screen bg-gradient-to-b from-[#f8f5f0] via-[#f4eee6] to-[#efe8de] flex flex-col items-center py-20 ">
                {/* Background decor */}
                <div className="absolute inset-0 -z-10">

                    <Image
                        src="https://localhost:7020/room_images/de778cd6-1b63-4ed2-92a2-b78e2430024f_imageRoom_3.jpg"
                        alt="Luxury background"
                        fill
                        className="object-cover opacity-30"
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-[#f9f5f2]/80 to-[#f5ece5]/85 backdrop-blur-sm" />
                </div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-6xl font-serif font-bold text-[#5a4634] tracking-wide mb-12"
                >
                    My Bookings
                </motion.h1>

                {/* Search bar */}
                <motion.div
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.7 }}
                    className="flex items-center justify-center gap-3 mb-16"
                >
                    <Input
                        size="large"
                        placeholder="Search by room name or booking code..."
                        prefix={<SearchOutlined />}
                        className="rounded-full w-[380x] shadow-md border border-[#d8cfc7] bg-white/80 focus:border-[#c7a17a] focus:shadow-lg transition-all duration-300"
                    />
                    <Button
                        type="primary"
                        shape="round"
                        size="large"
                        className="bg-[#c7a17a] hover:bg-[#b08b65] border-none shadow-md text-white px-8"
                    >
                        Search
                    </Button>
                </motion.div>

                {loading ? (
                    <Spin size="large" />
                ) : bookings.length === 0 ? (
                    <p className="text-[#7b6b5a] text-lg italic mt-10">No bookings found.</p>
                ) : (
                    <div className="flex flex-col gap-10 w-[90%] max-w-6xl">
                        {bookings.map((b, index) => (
                            <motion.div
                                key={b.id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 * index, duration: 0.6 }}
                                whileHover={{ scale: 1.02 }}
                                className="relative flex flex-col md:flex-row bg-white/90 rounded-3xl shadow-2xl overflow-hidden hover:shadow-[#dccbb6]/60 transition-all duration-500"
                            >
                                {/* Left image */}
                                <div className="relative w-full md:w-1/3 min-h-[250px]">

                                    <Image
                                        src="https://localhost:7020/room_images/de778cd6-1b63-4ed2-92a2-b78e2430024f_imageRoom_3.jpg"
                                        alt="Room"
                                        fill
                                        unoptimized
                                        className="object-cover"
                                    />
                                </div>

                                {/* Right info */}
                                <div className="w-full md:w-2/3 p-8 flex flex-col justify-between">
                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                        <div>
                                            <h2 className="text-2xl font-semibold text-[#4b3826] mb-3">
                                                {b.roomName} - {b.roomNumber}
                                            </h2>
                                            {/* <p className="text-[#6e6257] mb-1">
                                            <span className="font-medium text-[#3d2e24]">Booking Code:</span>{" "}
                                            {b.id}
                                        </p> */}
                                            <p className="text-[#6e6257] mb-1">
                                                <span className="font-medium text-[#3d2e24]">Guest:</span> {b.fullName}
                                            </p>
                                            <p className="text-[#6e6257] mb-3">
                                                <span className="font-medium text-[#3d2e24]">Phone:</span> {b.phone}
                                            </p>
                                            <span
                                                className={`inline-block mt-2 px-3 py-1 rounded-full text-base font-semibold border shadow-sm
                                                ${b.status === 0
                                                        ? "bg-[#fff6e5] text-[#8c6a2f] border-[#f0e2c2]"
                                                        : b.status === 1
                                                            ? "bg-[#e6fff1] text-[#2f8c56] border-[#b9e5c7]"
                                                            : "bg-[#ffeaea] text-[#a44b4b] border-[#e5b9b9]"
                                                    }`}
                                            >
                                                {b.status === 0
                                                    ? "Pending"
                                                    : b.status === 1
                                                        ? "Confirmed"
                                                        : "Cancelled"}
                                            </span>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-[#6e6257] mb-1">
                                                <strong>Check-in:</strong> {formatDate(b.checkInDate)}
                                            </p>
                                            <p className="text-[#6e6257] mb-3">
                                                <strong>Check-out:</strong> {formatDate(b.checkOutDate)}
                                            </p>
                                            <p className="text-2xl font-bold text-[#b58c64] mb-5">
                                                {b.price.toLocaleString()} <span className="text-lg align-top">₫</span>
                                            </p>
                                            <Button
                                                icon={<DeleteOutlined />}
                                                shape="round"
                                                size="large"
                                                className="bg-[#5a4634] hover:bg-[#3e2f22] text-white border-none shadow-lg px-6"
                                                onClick={() => handleCancel(b.id ? b.id : "")}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
