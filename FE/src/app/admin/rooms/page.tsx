"use client"
import { useEffect, useState } from "react";
import { Room } from "@/model/Room";
import { getRooms } from "@/api/getRoom";
import { Pagination } from 'antd';
import { Modal, Form, Input, Select, Button, message } from "antd";
import TextArea from "antd/es/input/TextArea";


export default function RoomManagement() {

    // get rooms
    const [rooms, setRooms] = useState<Room[]>([]);
    useEffect(() => {
        loadRoom();
    }, []);

    const loadRoom = async () => {
        const data = await getRooms();
        setRooms(data.list);
    }


    // edit 
    const [editModelVisible, setEditModalVisible] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    const [form] = Form.useForm();
    const [messageApi, contexHolder] = message.useMessage();


    const openEditModal = (room: Room) => {
        setSelectedRoom(room);
        form.setFieldsValue({
            ...room,
            imageUrl: room.imageUrl || [], // đảm bảo là mảng
        });
        setEditModalVisible(true);
    };

    const handleEditSubmit = async () => {
        try {
            const values = await form.validateFields();
            const updated = {
                ...selectedRoom,
                ...values,

            };

            setRooms(prev => prev.map(r => r.id === updated.id ? updated : r));
            setEditModalVisible(false);
            messageApi.success("Room updated successfully!")
        } catch (err) {
            messageApi.error("Room update successfully!");
        }
    };

    const handleCancle = () => {
        setEditModalVisible(false);
        setAddModalVisible(false);
        form.resetFields();
    }
    const [addModalVisible, setAddModalVisible] = useState(false);

    const handleAddRoom = () => {
        form.resetFields(); // form trống
        setAddModalVisible(true);
    };

    const handleAddSubmit = async () => {
        try {
            const values = await form.validateFields();
            const newRoom: Room = {
                id: Math.random(), // tạm thời random id
                ...values,
            };
            setRooms(prev => [...prev, newRoom]);
            setAddModalVisible(false);
            messageApi.success("Room added successfully!");
        } catch (err) {
            messageApi.error("Failed to add room!");
        }
    };
    // temp roomTypes
    const roomTypes = [
        { value: "standard", label: "Standard" },
        { value: "deluxe", label: "Deluxe" },
        { value: "suite", label: "Suite" },
    ];

    // curetnpage 
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // filter by status
    const totalRoom = rooms.length;
    const availableCount = rooms.filter(r => r.status === 1).length;
    const unavailableCount = rooms.filter(r => r.status === 0).length;

    const [statusFilter, setStatusFilter] = useState<"all" | 0 | 1>("all");

    const filteredByStatus = statusFilter === "all" ? rooms : rooms.filter(r => r.status === statusFilter);



    const handleFilterClick = (filter: "all" | 0 | 1) => {
        setStatusFilter(filter);
        setCurrentPage(1);
    }

    // Tính toán dữ liệu hiển thị
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentRooms = filteredByStatus.slice(indexOfFirst, indexOfLast);

    const getStatusLabel = (status: number) => {
        switch (status) {
            case 0:
                return { text: "Unavailable", color: "bg-yellow-500" };
            case 1:
                return { text: "Available", color: "bg-green-500" };
            default:
                return { text: "Unknown", color: "bg-gray-500" };
        }
    };

    return (
        <>
            {contexHolder}
            <div className=" font-semibold text-lg">Room Mangement</div>
            <div className=" my-3 border border-b-1 container mx-auto bg-black "></div>
            <div className="flex justify-start gap-5 pt-4 container mb-10">
                <input type="search"
                    placeholder="Search by id, roomNumber, roomName ... "
                    className="border p-2 rouded-md w-96"
                    onChange={(e) => {
                        setCurrentPage(1);
                    }}
                />
                <button
                    type="button"
                    className="bg-sky-900  !text-white text-xl font-semibold  px-4 py-1  rounded-md hover:bg-blue-600"
                    onClick={handleAddRoom}
                >
                    Add room
                </button>
            </div>

            {/*summary box */}
            <div className="flex gap-5 container mx-auto mb-10">
                <div
                    onClick={() => handleFilterClick("all")}
                    className={`cursor-pointer flex flex-col items-center gap-2 border rounded-lg px-10 py-5 w-64 transition ${statusFilter === "all" ? "bg-blue-100 border-blue-500 " : "hover:bg-gray-50"}`}>
                    <div className="flex item-center gap-3">
                        <span className="w-8 h-8 bg-blue-300 rounded-full inline-block"></span>
                        <span className="inline-block w-32 ">Total Room</span>
                    </div>
                    <span>{totalRoom}</span>

                </div>
                <div
                    onClick={() => handleFilterClick(1)}
                    className={`cursor-pointer flex flex-col items-center gap-2 border rounded-lg px-10 py-5 w-64 transition ${statusFilter === 1 ? "bg-green-100 border-green-500 " : "hover:bg-gray-50"}`}>
                    <div className="flex item-center gap-3">
                        <span className="w-8 h-8 bg-green-300 rounded-full inline-block"></span>
                        <span className="inline-block w-32 ">Available</span>
                    </div>
                    <span>{availableCount}</span>

                </div>
                <div
                    onClick={() => handleFilterClick(0)}
                    className={`cursor-pointer flex flex-col items-center gap-2 border rounded-lg px-10 py-5 w-64 transition ${statusFilter === 0 ? "bg-yellow-100 border-yellow-500 " : "hover:bg-gray-50"}`}>
                    <div className="flex item-center gap-3">
                        <span className="w-8 h-8 bg-yellow-300 rounded-full inline-block"></span>
                        <span className="inline-block w-32 ">Unavailable</span>
                    </div>
                    <span>{unavailableCount}</span>

                </div>
            </div>

            {/* Table */}
            <div className="container mx-auto my-10 bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full text-base">
                    <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-left text-gray-700 text-lg font-semibold">
                        <tr>
                            <th className="px-6 py-3">No</th>
                            <th className="px-6 py-3 w-[250px]">Room Name</th>
                            <th className="px-6 py-3">Price</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Description</th>
                            <th className="px-6 py-3">Bed</th>
                            <th className="px-6 py-3">Guests</th>
                            <th className="px-6 py-3">Space</th>
                            <th className="px-6 py-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 !text-base">
                        {currentRooms.map((room, index) => {
                            const status = getStatusLabel(room.status);
                            return (
                                <tr key={room.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-3">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                    <td className="px-6 py-3 font-medium text-gray-800"><div>{room.roomName} - {room.roomNumber}</div>
                                    </td>
                                    <td className="px-6 py-3 font-semibold text-blue-600">
                                        {room.basePrice.toLocaleString("vi-VN")} đ
                                    </td>
                                    <td className="px-6 py-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-base font-medium !text-white
                                            } ${status.color}`}
                                        >
                                            {status.text}
                                        </span>
                                    </td>

                                    <td className="px-6 py-3 text-gray-500  max-w-[150px]">
                                        {room.description || "-"}
                                    </td>
                                    <td className="px-6 py-3">{room.bedType}</td>
                                    <td className="px-6 py-3">
                                        {room.adult} Adults, {room.children} Children
                                    </td>
                                    <td className="px-6 py-3">{room.space} m²</td>

                                    <td className="px-6 py-3 text-center">
                                        <div className="flex justify-center gap-2">
                                            <div className="bg-emerald-400 p-3 px-5 text-white rounded rounded-(200px) " onClick={() => openEditModal(room)} >Edit</div>
                                            <div className="bg-rose-400 p-3 px-5 text-white rounded rounded-(200px)"  >Remove</div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
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
            <Modal
                title={<span className="text-xl font-semibold text-blue-600 ">Edit Room</span>}
                open={editModelVisible}
                onCancel={handleCancle}
                centered
                footer={[
                    <Button key="cancle" onClick={handleCancle}>Cancel</Button>,
                    <Button key="save" type="primary" className="bg-blue-600" onClick={handleEditSubmit}>Save Changes</Button>
                ]}

            >
                <Form
                    form={form}
                    layout="vertical"
                    className="mt-4">


                    <div className="flex gap-3">
                        <Form.Item name="roomName" label="Room Name" className="w-2/3">
                            <Input ></Input>
                        </Form.Item>
                        <Form.Item name="roomNumber" label="Room Number" className="w-1/3">
                            <Input ></Input>
                        </Form.Item>
                    </div>
                    <Form.Item name="description" label="Description" className="">
                        <TextArea ></TextArea>
                    </Form.Item>
                    <div className="flex gap-3">

                    </div>
                    <div className="flex gap-3">

                        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                            <Select>
                                <Select.Option value={0}>Pending</Select.Option>
                                <Select.Option value={1}>Approved</Select.Option>
                                <Select.Option value={2}>Cancelled</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="roomType" label="Room Type" >
                            <Select placeholder={selectedRoom?.typeName} options={roomTypes} />
                        </Form.Item>
                    </div>
                    <div className="mb-2 font-medium">Image URLs</div>
                    <Form.List name="imageUrl">
                        {(fields, { add, remove }) => (
                            <div className="flex flex-col gap-2">
                                {fields.map(({ key, name, ...restField }) => (
                                    <div key={key} className="flex items-center gap-3 mb-2">
                                        <Form.Item
                                            {...restField}
                                            name={name}
                                            className="flex-1 !mb-0"
                                            rules={[{ required: true, message: "Please enter image URL" }]}
                                        >
                                            <Input placeholder="Enter image URL" />
                                        </Form.Item>
                                        <Button danger onClick={() => remove(name)}>Remove</Button>
                                    </div>
                                ))}
                                <Button type="dashed" onClick={() => add()} block>
                                    + Add Image URL
                                </Button>
                            </div>
                        )}
                    </Form.List>


                </Form>

            </Modal>

            {/*Add room modal*/}
            <Modal
                title={<span className="text-xl font-semibold text-green-600">Add Room</span>}
                open={addModalVisible}
                onCancel={handleCancle}
                centered
                footer={[
                    <Button key="cancel" onClick={handleCancle}>Cancel</Button>,
                    <Button key="add" type="primary" className="bg-green-600" onClick={handleAddSubmit}>Add Room</Button>
                ]}
            >
                <Form form={form} layout="vertical" className="mt-4">
                    <div className="flex gap-3">
                        <Form.Item name="roomName" label="Room Name" className="w-2/3" rules={[{ required: true }]}><Input /></Form.Item>
                        <Form.Item name="roomNumber" label="Room Number" className="w-1/3" rules={[{ required: true }]}><Input /></Form.Item>
                    </div>
                    <Form.Item name="description" label="Description"><TextArea /></Form.Item>

                    {/* 🆕 Select Room Type */}


                    <div className="flex gap-3">
                        <Form.Item name="roomType" label="Room Type" rules={[{ required: true }]}>
                            <Select placeholder="Select room type" options={roomTypes} />
                        </Form.Item>
                        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                            <Select>
                                <Select.Option value={0}>Unavailable</Select.Option>
                                <Select.Option value={1}>Available</Select.Option>
                            </Select>
                        </Form.Item>

                    </div>

                    <div className="mb-2 font-medium">Image URLs</div>
                    <Form.List name="imageUrl">
                        {(fields, { add, remove }) => (
                            <div className="flex flex-col gap-2 ">
                                {fields.map(({ key, name, ...restField }) => (
                                    <div key={key} className="flex gap-2 items-center mb-2">
                                        <Form.Item
                                            {...restField}
                                            name={name}
                                            className="flex-1 !mb-0"
                                            rules={[{ required: true, message: "Please enter image URL" }]}
                                        >
                                            <Input placeholder="Enter image URL" />
                                        </Form.Item>
                                        <Button danger onClick={() => remove(name)}>Remove</Button>
                                    </div>
                                ))}
                                <Button type="dashed" onClick={() => add()} block>+ Add Image URL</Button>
                            </div>
                        )}
                    </Form.List>
                </Form>
            </Modal>

        </>
    );
}
