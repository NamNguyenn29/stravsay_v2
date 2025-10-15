'use client';
import { Booking } from "@/model/Booking";
import { User } from "@/model/User";
import { Room } from "@/model/Room";
import { getBookings } from "@/api/getBooking";
import { useState, useEffect } from "react";
import { getUserById } from "@/api/getUserById";
import { getRoomById } from "@/api/getRoomById";
import { Pagination, Modal, Form, Input, Select, DatePicker, Button, message } from "antd";
import dayjs from "dayjs";

export default function BookingMangement() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [users, setUsers] = useState<Record<string, User>>({});
    const [rooms, setRooms] = useState<Record<string, Room>>({});
    const roomList = Object.values(rooms);

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [form] = Form.useForm();

    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        getBookings().then(setBookings);
    }, []);

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
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const filteredByStatus =
        activeFilter === "all" ? bookings : bookings.filter(b => b.status === activeFilter);

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentBooking = filteredByStatus.slice(indexOfFirst, indexOfLast);

    const getStatusLabel = (status: number) => {
        switch (status) {
            case 0: return { text: "Pending", color: "bg-yellow-500" };
            case 1: return { text: "Approved", color: "bg-green-500" };
            case 2: return { text: "Cancelled", color: "bg-red-500" };
            default: return { text: "Unknown", color: "bg-gray-500" };
        }
    };

    const openEditModal = (booking: Booking) => {
        setSelectedBooking(booking);
        form.setFieldsValue({
            ...booking,
            checkInDate: dayjs(booking.checkInDate),
            checkOutDate: dayjs(booking.checkOutDate),
        });
        setEditModalVisible(true);
    };

    const handleEditSubmit = async () => {
        try {
            const values = await form.validateFields();
            const updated = {
                ...selectedBooking,
                ...values,
                checkInDate: values.checkInDate.format("YYYY-MM-DD"),
                checkOutDate: values.checkOutDate.format("YYYY-MM-DD"),
            };

            // call API update booking (ví dụ)
            // await updateBooking(updated);

            setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
            setEditModalVisible(false);
            messageApi.success("Booking updated successfully!");
        } catch (err) {
            messageApi.error("Please fill out the form correctly!");
        }
    };

    const handleCancel = () => {
        setEditModalVisible(false);
        form.resetFields();
    };

    return (
        <>
            {contextHolder}
            <div className="font-semibold text-lg">Booking Management</div>
            <div className="my-3 border-b border-gray-300"></div>

            <div className="mb-5 bg-white shadow-md rounded-xl overflow-hidden container mx-auto">
                <table className="min-w-full text-base">
                    <thead className="bg-gray-100 text-gray-700 text-left font-semibold">
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
                        {currentBooking.map((booking, index) => {
                            const status = getStatusLabel(booking.status);
                            return (
                                <tr key={booking.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                    <td className="px-6 py-4">
                                        <div>{users[booking.userId]?.fullName || "Loading..."}</div>
                                        <div className="text-gray-500 text-sm">{users[booking.userId]?.phone || "-"}</div>
                                    </td>
                                    <td className="px-6 py-4">{rooms[booking.roomId]?.roomNumber || "Loading..."}</td>
                                    <td className="px-6 py-4">{booking.checkInDate}</td>
                                    <td className="px-6 py-4">{booking.checkOutDate}</td>
                                    <td className="px-6 py-4 text-right">{booking.price.toLocaleString()}₫</td>
                                    <td className="px-6 py-4">{booking.discountCode || "-"}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-2 rounded-full text-white text-sm font-semibold ${status.color}`}>
                                            {status.text}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center flex gap-5">
                                        <button
                                            onClick={() => openEditModal(booking)}
                                            className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg shadow"
                                        >
                                            Edit
                                        </button>
                                        <button className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg shadow">
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <Pagination
                current={currentPage}
                pageSize={itemsPerPage}
                total={filteredByStatus.length}
                showSizeChanger
                pageSizeOptions={[5, 10, 20, 50]}
                onChange={(page, pageSize) => {
                    setCurrentPage(page);
                    setItemsPerPage(pageSize);
                }}
                className="text-center flex justify-end"
                showTotal={(total) => `Total ${total} bookings`}
            />

            {/*  Edit Booking Modal */}
            <Modal
                title={<span className="text-xl font-semibold text-blue-600">Edit Booking</span>}
                open={editModalVisible}
                onCancel={handleCancel}
                centered
                footer={[
                    <Button key="cancel" onClick={handleCancel}>Cancel</Button>,
                    <Button key="save" type="primary" className="bg-blue-600" onClick={handleEditSubmit}>
                        Save Changes
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="mt-4"
                >
                    <Form.Item label="User Name">
                        <Input value={users[selectedBooking?.userId || ""]?.fullName} disabled />
                    </Form.Item>

                    <Form.Item
                        name="roomId"
                        label="Room"
                        rules={[{ required: true, message: "Please select a room" }]}
                    >
                        <Select
                            placeholder="Select a room"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {roomList.map((r) => (
                                <Select.Option key={r.id} value={r.id}>
                                    {r.roomNumber} — {r.roomName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>


                    <div className="flex gap-3">
                        <Form.Item name="checkInDate" label="Check In" className="w-1/2" rules={[{ required: true }]}>
                            <DatePicker className="w-full" format="YYYY-MM-DD" />
                        </Form.Item>

                        <Form.Item name="checkOutDate" label="Check Out" className="w-1/2" rules={[{ required: true }]}>
                            <DatePicker className="w-full" format="YYYY-MM-DD" />
                        </Form.Item>
                    </div>

                    <div className="flex gap-3">
                        <Form.Item name="price" label="Price" className="w-1/2" rules={[{ required: true, message: "Price is required" }]}>
                            <Input type="number" suffix="₫" />
                        </Form.Item>

                        <Form.Item name="discountCode" label="Discount Code" className="w-1/2">
                            <Input placeholder="Optional" />
                        </Form.Item>
                    </div>

                    <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value={0}>Pending</Select.Option>
                            <Select.Option value={1}>Approved</Select.Option>
                            <Select.Option value={2}>Cancelled</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
