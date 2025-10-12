'use client';
import { Booking } from "@/model/Booking";
import { User } from "@/model/User";
import { Room } from "@/model/Room";
import { getBookings } from "@/api/getBooking";
import { useState, useEffect } from "react";
import { getUserById } from "@/api/getUserById";
import { getRoomById } from "@/api/getRoomById";
import { Pagination } from "antd";

export default function BookingMangement() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [users, setUsers] = useState<Record<string, User>>({});
    const [rooms, setRooms] = useState<Record<string, Room>>({});
    useEffect(() => {
        getBookings().then(setBookings);
    }, []);

    const totalBooking = bookings.length;
    const pendingCount = bookings.filter(b => b.status == 0).length;
    const approvedCount = bookings.filter(b => b.status == 1).length;
    const cancelCount = bookings.filter(b => b.status == 2).length;
    const income = bookings
        .filter(b => b.status == 1)
        .reduce((sum, b) => sum + b.price, 0);


    useEffect(() => {
        bookings.forEach((b) => {
            if (!users[b.userId]) {
                getUserById(b.userId).then((u) => {
                    if (u) setUsers((prev) => ({ ...prev, [b.userId]: u }));
                });
            }
            if (!rooms[b.roomId]) {
                getRoomById(b.roomId).then((r) => {
                    if (r) setRooms((prev) => ({ ...prev, [b.roomId]: r }));
                });
            }
        });
    }, [bookings]);



    const [activeFilter, setActiveFilter] = useState<"all" | 0 | 1 | 2>("all");
    const [searchTerm, setSearchTerm] = useState("");



    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const filteredByStatus =
        activeFilter === "all" ? bookings : bookings.filter(b => b.status === activeFilter);



    // phân trang
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    // const currentBooking = filteredBookings.slice(indexOfFirst, indexOfLast);
    const currentBooking = filteredByStatus.slice(indexOfFirst, indexOfLast);

    const handleFilterClick = (filter: "all" | 0 | 1 | 2) => {
        setActiveFilter(filter);
        setCurrentPage(1);
    };

    const getStatusLabel = (status: number) => {
        switch (status) {
            case 0:
                return { text: "Pending", color: "bg-yellow-500" };
            case 1:
                return { text: "Approved", color: "bg-green-500" };
            case 2:
                return { text: "Cancelled", color: "bg-red-500" };
            default:
                return { text: "Unknown", color: "bg-gray-500" };
        }
    };

    return (
        <>

            <div className="font-semibold text-lg">Booking Mangement</div>
            <div className=" my-3 border border-b-1 container  bg-black "></div>

            {/* Search */}
            <div className="flex justify-start gap-5   container  mb-10">
                <input
                    type="search"
                    placeholder="Search by room number, guest name, or phone"
                    className="w-96 border p-2  rounded-md "


                />
            </div>

            {/* Summary box */}
            <div className="flex gap-5 container mx-auto mb-10">
                <div
                    onClick={() => handleFilterClick("all")}
                    className={`cursor-pointer flex flex-col items-center gap-2 border rounded-lg px-10 py-5 w-64 transition
                        ${activeFilter === "all" ? "bg-blue-100 border-blue-500" : "hover:bg-gray-50"}`}
                >
                    <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-blue-300 rounded-full inline-block "></span>
                        <span className="inline-block w-32">Total Booking</span>
                    </div>
                    <span className="text-xl font-bold">{totalBooking}</span>
                </div>

                <div
                    onClick={() => handleFilterClick(1)}
                    className={`cursor-pointer flex flex-col items-center gap-2 border rounded-lg px-10 py-5 w-40 transition
                        ${activeFilter === 1 ? "bg-green-100 border-green-500" : "hover:bg-gray-50"}`}
                >
                    <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-green-300 rounded-full inline-block "></span>
                        <span>Approved</span>
                    </div>
                    <span className="text-xl font-bold">{approvedCount}</span>
                </div>

                <div
                    onClick={() => handleFilterClick(0)}
                    className={`cursor-pointer flex flex-col items-center gap-2 border rounded-lg px-10 py-5 w-40 transition
                        ${activeFilter === 0 ? "bg-yellow-100 border-yellow-500" : "hover:bg-gray-50"}`}
                >
                    <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-yellow-300 rounded-full inline-block "></span>
                        <span>Pending</span>
                    </div>
                    <span className="text-xl font-bold">{pendingCount}</span>
                </div>

                <div
                    onClick={() => handleFilterClick(2)}
                    className={`cursor-pointer flex flex-col items-center gap-2 border rounded-lg px-10 py-5 w-40 transition
                        ${activeFilter === 2 ? "bg-red-100 border-red-500" : "hover:bg-gray-50"}`}
                >
                    <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-rose-300 rounded-full inline-block "></span>
                        <span>Cancelled</span>
                    </div>
                    <span className="text-xl font-bold">{cancelCount}</span>
                </div>

                <div className="flex flex-col items-center gap-2 border rounded-lg px-10 py-5 w-64">
                    <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-purple-300 rounded-full inline-block "></span>
                        <span>Income</span>
                    </div>
                    <span className="text-xl font-bold">{income.toLocaleString()} đ</span>
                </div>
            </div>
            {/* Table */}
            <div className="mb-5 bg-white shadow-md rounded-xl overflow-hidden container mx-auto">
                <table className="min-w-full text-base">
                    <thead className="bg-gray-100 text-gray-700 text-left text-base font-semibold">
                        <tr>
                            <th className="px-6 py-3">No</th>
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Room</th>
                            <th className="px-6 py-3">Check In</th>
                            <th className="px-6 py-3">Check Out</th>
                            <th className="px-6 py-3 text-center">Price</th>
                            <th className="px-6 py-3">Discount</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {currentBooking.length > 0 ? (
                            currentBooking.map((booking, index) => {
                                const status = getStatusLabel(booking.status);
                                return (

                                    <tr key={booking.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4"> {index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                        <td className="px-6 py-4">
                                            <div>{users[booking.userId]?.fullName || "Loading..."}</div>
                                            <div className="text-gray-500 text-sm">{users[booking.userId]?.phone || "-"}</div>
                                            <div className="text-gray-500 text-sm">{users[booking.userId]?.email || "-"}</div>
                                        </td>
                                        <td className="px-6 py-4">{rooms[booking.roomId]?.roomNumber || "Loading..."}</td>
                                        <td className="px-6 py-4">{booking.checkInDate}</td>
                                        <td className="px-6 py-4">{booking.checkOutDate}</td>
                                        <td className="px-6 py-4 text-right">{booking.price.toLocaleString()}₫</td>
                                        <td className="px-6 py-4">{booking.discountCode ? `#${booking.discountCode}` : "-"}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wide
                                            ${status.color}`}
                                            >
                                                {status.text}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button

                                                className="px-4 py-2 text-sm font-medium !text-white bg-red-500 hover:bg-red-600 rounded-lg shadow"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan={9} className="text-center py-6 text-gray-500">
                                    No bookings found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <Pagination
                current={currentPage}                // Trang hiện tại
                pageSize={itemsPerPage}              // Số item mỗi trang
                total={filteredByStatus.length}      // Tổng item (có thể là rooms.length hoặc filteredByStatus.length)
                showSizeChanger                      // Cho phép chọn số item/trang
                pageSizeOptions={[5, 10, 20, 50]}    // Tùy chọn số dòng mỗi trang
                onChange={(page, pageSize) => {
                    setCurrentPage(page);
                    setItemsPerPage(pageSize);
                }}
                className="text-center flex justify-end !text-lg"
                showTotal={(total) => `Total ${total} items`}
                showQuickJumper


            />

        </>
    )
}
