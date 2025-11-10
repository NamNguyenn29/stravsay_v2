'use client';
import { Booking } from "@/model/Booking";
import { getBookings } from "@/api/Booking/getBooking";
import { useState, useEffect, useCallback } from "react";
import { Pagination, Modal, Form, Input, DatePicker, Button, message } from "antd";
import dayjs from "dayjs";
import { SearchOutlined } from "@ant-design/icons";
import { BookingService } from "@/services/bookingService";

export default function BookingMangement() {
    const [bookings, setBookings] = useState<Booking[]>([]);

    const [viewModalVisible, setviewModalVisible] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [form] = Form.useForm();
    const [totalElement, setTotalElement] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState<boolean>(false);


    const loadingBooking = useCallback(async () => {
        const data = await getBookings(currentPage, pageSize);
        setBookings(data.list);
        setTotalElement(data.totalElement);
    }, [currentPage, pageSize]);

    useEffect(() => {
        loadingBooking();
    }, [currentPage, loadingBooking, pageSize]);


    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return dayjs(dateString).format("DD/MM/YYYY - HH:MM "); //
    };

    const getStatusLabel = (status: number) => {
        switch (status) {
            case 0: return { text: "Pending", color: "bg-yellow-500" };
            case 1: return { text: "Approved", color: "bg-green-500" };
            case 2: return { text: "Cancelled", color: "bg-red-500" };
            default: return { text: "Unknown", color: "bg-gray-500" };
        }
    };

    const openviewModal = (booking: Booking) => {
        setSelectedBooking(booking);
        form.setFieldsValue({
            ...booking,
            checkInDate: dayjs(booking.checkInDate),
            checkOutDate: dayjs(booking.checkOutDate),
            status: getStatusLabel(booking.status).text
        });
        setviewModalVisible(true);
    };

    const handleCancel = () => {
        setviewModalVisible(false);
        form.resetFields();
    };

    const approveBooking = async (id: string) => {
        setLoading(true);
        const res = await BookingService.approveBooking(id);
        if (res.data.isSuccess) {
            messageApi.success(res.data.message);
        } else {
            messageApi.error(res.data.message);
        }
        loadingBooking();
        setLoading(false);

    }

    const removeBooking = async (id: string) => {
        const res = await BookingService.deleteBooking(id);
        if (res.data.isSuccess) {
            messageApi.success(res.data.message);
        } else {
            messageApi.error(res.data.message);
        }
        loadingBooking();
    }

    return (
        <>
            {contextHolder}
            <div className="font-semibold text-lg">Booking Management</div>
            <div className="my-3 border-b border-gray-300"></div>
            {/* Search */}
            <div className="flex justify-start gap-5   container  mb-10">
                <input
                    type="search"
                    placeholder="Search by room number, guest name, or phone"
                    className="w-96 border p-2  rounded-md "

                />
                <Button type="primary" icon={<SearchOutlined />} iconPosition={'start'} size="large">
                    Search
                </Button>
            </div>
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
                        {bookings.map((booking, index) => {
                            const status = getStatusLabel(booking.status);
                            return (
                                <tr key={booking.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">{index + 1 + (currentPage - 1) * pageSize}</td>
                                    <td className="px-6 py-4">
                                        <div>{booking.fullName || "Loading..."}</div>
                                        <div className="text-gray-500 text-sm">{booking.phone || "-"}</div>
                                    </td>
                                    <td className="px-6 py-4">{booking.roomNumber || "Loading..."}</td>
                                    <td className="px-6 py-4">{formatDate(booking.checkInDate)}</td>
                                    <td className="px-6 py-4">{formatDate(booking.checkOutDate)}</td>
                                    <td className="px-6 py-4 text-right">{booking.price.toLocaleString()}₫</td>
                                    <td className="px-6 py-4">{booking.discountCode || "-"}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-2 rounded-full text-white text-sm font-semibold ${status.color}`}>
                                            {status.text}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center flex gap-5">
                                        <button
                                            onClick={() => openviewModal(booking)}
                                            className="px-4 py-2 text-sm font-medium !text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg shadow"
                                        >
                                            View
                                        </button>
                                        <button className="px-4 py-2 text-sm font-medium !text-white bg-red-500 hover:bg-red-600 rounded-lg shadow" onClick={() => removeBooking(booking.id)}>
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
                pageSize={pageSize}
                total={totalElement}
                showSizeChanger
                pageSizeOptions={[5, 10, 20, 50]}
                onChange={(page, pageSize) => {
                    setCurrentPage(page);
                    setPageSize(pageSize);
                }}
                className="text-center flex justify-end"
                showTotal={(total) => `Total ${total} bookings`}
            />

            {/*  view Booking Modal */}
            <Modal
                title={<span className="text-xl font-semibold text-blue-600">view Booking</span>}
                open={viewModalVisible}
                onCancel={handleCancel}
                centered
                footer={[
                    (selectedBooking?.status == 0 &&
                        <Button key="save" type="primary" className="bg-blue-600" onClick={() => approveBooking(selectedBooking.id)} loading={loading} >
                            Approve
                        </Button>
                    ),
                    < Button key="cancel" onClick={handleCancel} > Close</Button >,

                ]
                }
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="mt-4"
                >
                    <Form.Item label="User Name">
                        <Input value={selectedBooking?.fullName} />
                    </Form.Item>

                    <Form.Item
                        label="Room"
                    >
                        <Input value={selectedBooking?.roomNumber} />
                    </Form.Item>


                    <div className="flex gap-3">
                        <Form.Item name="checkInDate" label="Check In" className="w-1/2" >
                            <DatePicker className="w-full" format="YYYY-MM-DD" />
                        </Form.Item>

                        <Form.Item name="checkOutDate" label="Check Out" className="w-1/2" >
                            <DatePicker className="w-full" format="YYYY-MM-DD" />
                        </Form.Item>
                    </div>

                    <div className="flex gap-3">
                        <Form.Item name="price" label="Price" className="w-1/2" >
                            <Input type="number" suffix="₫" />
                        </Form.Item>

                        <Form.Item name="discountCode" label="Discount Code" className="w-1/2">
                            <Input placeholder="" />
                        </Form.Item>
                    </div>

                    <Form.Item name="status" label="Status" >
                        <Input placeholder="" />
                    </Form.Item>
                </Form>
            </Modal >
        </>
    );
}
