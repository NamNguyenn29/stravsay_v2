"use client"
import { useEffect, useState } from "react";
import { Room } from "@/model/Room";
import { getRooms } from "@/api/RoomApi/getRoom";
import { Pagination } from 'antd';
import { Modal, Form, Input, Select, Button, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { getRoomType } from "@/api/getRoomType";
import { RoomType } from "@/model/RoomType";
import { createRoom } from "@/api/RoomApi/createRoom";
import { updateRoom } from "@/api/RoomApi/updateRoom";
import { deleteRoom } from "@/api/RoomApi/deleteRoom";
import "@/css/modal.css"


export default function RoomManagement() {

    // get rooms
    const [rooms, setRooms] = useState<Room[]>([]);
    useEffect(() => {
        loadRoom();
        loadRoomType();
    }, []);

    const loadRoom = async () => {
        const data = await getRooms();
        setRooms(data.list);
    }
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const loadRoomType = async () => {
        const data = await getRoomType();
        setRoomTypes(data.list);
    }



    // edit 
    const [editModelVisible, setEditModalVisible] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    const [form] = Form.useForm();
    const [messageApi, contexHolder] = message.useMessage();


    const openEditModal = (room: Room) => {
        setSelectedRoom(room);
        form.setFieldsValue({
            roomName: room.roomName,
            roomNumber: room.roomNumber,
            description: room.description,
            roomType: room.roomTypeID, // ✅ lấy đúng id loại phòng
            floor: room.floor,
            imageUrl: room.imageUrl || [],
            status: room.status
        });
        setEditModalVisible(true);
    };

    const handleEditSubmit = async () => {
        try {
            const values = await form.validateFields();

            if (!selectedRoom) {
                messageApi.error("No room selected!");
                return;
            }

            // Backend yêu cầu RoomRequest
            const updatedData = {
                roomName: values.roomName,
                roomNumber: values.roomNumber,
                description: values.description,
                roomTypeID: values.roomType, // ✅ backend dùng RoomTypeID
                floor: values.floor,
                imageUrl: values.imageUrl || [],
                status: values.status
            };

            const response = await updateRoom(selectedRoom.id, updatedData);

            if (response.isSuccess) {
                messageApi.success("Room updated successfully!");
                setEditModalVisible(false);
                form.resetFields();
                await loadRoom(); // ✅ reload lại danh sách sau khi update
            } else {
                messageApi.error(response.message || "Failed to update room!");
            }
        } catch (err) {
            console.error("Error updating room:", err);
            messageApi.error("Error updating room!");
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

            const payload = {
                roomName: values.roomName,
                roomNumber: values.roomNumber,
                description: values.description,
                roomTypeID: values.roomType,
                floor: values.floor,
                imageUrl: values.imageUrl || [],
                status: values.status
            };
            const res = await createRoom(payload);

            if (res.isSuccess) {
                messageApi.success("Room added successfully!");
                setAddModalVisible(false);
                form.resetFields();
                await loadRoom();
            }
        } catch (err) {
            console.error("Error adding room:", err);
            messageApi.error("Failed to add room!");
        }
    };
    const [modal, modalContextHolder] = Modal.useModal();

    const handleDeleteRoom = (id: string) => {
        modal.confirm({
            title: "Are you sure you want to delete this room?",
            content: "This action cannot be undone.",
            centered: true,
            okText: "Yes, delete it",
            cancelText: "Cancel",
            okType: "danger",
            className: "custom-delete-confirm",

            async onOk() {
                const res = await deleteRoom(id);
                if (res.isSuccess) {
                    message.success(res.message || "Room deleted successfully!");
                    await loadRoom();
                } else {
                    message.error(res.message || "Failed to delete room!");
                }
            },
        });
    };



    // curetnpage 
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);





    // Tính toán dữ liệu hiển thị
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentRooms = rooms.slice(indexOfFirst, indexOfLast);

    const getStatusLabel = (status: string) => {
        if (status.includes("Unavailable")) {

            return { text: "Unavailable", color: "bg-yellow-500" };
        }
        else if (status.includes("Available")) {
            return { text: "Available", color: "bg-green-500" };
        }
        else {
            return { text: "Unknown", color: "bg-gray-500" };
        }
    }


    return (
        <>
            {contexHolder}
            {modalContextHolder}
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
            {/* <div className="flex gap-5 container mx-auto mb-10">
                <div

                    className={`cursor-pointer flex flex-col items-center gap-2 border rounded-lg px-10 py-5 w-64 transition ${} ? "bg-blue-100 border-blue-500 " : "hover:bg-gray-50"}`}>
                    <div className="flex item-center gap-3">
                        <span className="w-8 h-8 bg-blue-300 rounded-full inline-block"></span>
                        <span className="inline-block w-32 ">Total Room</span>
                    </div>
                    <span>{ }</span>

                </div>
                <div

                    className={`cursor-pointer flex flex-col items-center gap-2 border rounded-lg px-10 py-5 w-64 transition ${ } ? "bg-green-100 border-green-500 " : "hover:bg-gray-50"}`}>
                    <div className="flex item-center gap-3">
                        <span className="w-8 h-8 bg-green-300 rounded-full inline-block"></span>
                        <span className="inline-block w-32 ">Available</span>
                    </div>
                    <span>{ }</span>

                </div>
                <div

                    className={`cursor-pointer flex flex-col items-center gap-2 border rounded-lg px-10 py-5 w-64 transition ${} ? "bg-yellow-100 border-yellow-500 " : "hover:bg-gray-50"}`}>
                    <div className="flex item-center gap-3">
                        <span className="w-8 h-8 bg-yellow-300 rounded-full inline-block"></span>
                        <span className="inline-block w-32 ">Unavailable</span>
                    </div>
                    <span>{ }</span>

                </div>
            </div> */}

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
                                            <div className="bg-rose-400 p-3 px-5 text-white rounded rounded-(200px) cursor-pointer" onClick={() => handleDeleteRoom(room.id)} >Remove</div>
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
                total={currentRooms.length}      // Tổng item (có thể là rooms.length hoặc filteredByStatus.length)
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
                                <Select.Option value={"Unavailable"}>Unavailable</Select.Option>
                                <Select.Option value={"Available"}>Available</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="roomType"
                            label="Room Type"
                            rules={[{ required: true, message: "Please select room type" }]}
                        >
                            <Select
                                placeholder={selectedRoom?.typeName}
                                options={roomTypes.map(rt => ({
                                    label: rt.typeName,
                                    value: rt.id,
                                }))}
                            />
                        </Form.Item>
                        <Form.Item name="floor" label="Floor " className="w-1/3" rules={[{ required: true }]}><Input /></Form.Item>
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

            </Modal >

            {/*Add room modal*/}
            < Modal
                title={< span className="text-xl font-semibold text-green-600" > Add Room</span >}
                open={addModalVisible}
                onCancel={handleCancle}
                centered
                footer={
                    [
                        <Button key="cancel" onClick={handleCancle}>Cancel</Button>,
                        <Button key="add" type="primary" className="bg-green-600" onClick={handleAddSubmit}>Add Room</Button>
                    ]}
            >
                <Form form={form} layout="vertical" className="mt-4">
                    <div className="flex gap-3">
                        <Form.Item name="roomName" label="Room Name" className="w-2/3" rules={[{ required: true }]}><Input /></Form.Item>
                        <Form.Item name="roomNumber" label="Room Number" className="w-1/3" rules={[{ required: true }]}><Input /></Form.Item>
                    </div>
                    <Form.Item name="description" label="Description" rules={[{ required: true }]}><TextArea /></Form.Item>
                    <div className="flex gap-3">
                        <Form.Item
                            name="roomType"
                            label="Room Type"
                            rules={[{ required: true, message: "Please select room type" }]}
                        >
                            <Select
                                placeholder="Select room type"
                                options={roomTypes.map(rt => ({
                                    label: rt.typeName,
                                    value: rt.id,
                                }))}
                            />
                        </Form.Item>
                        <Form.Item name="status" label="Status" rules={[{ required: true }]} className="w-[100px]"  >
                            <Select>
                                <Select.Option value={"Unavailable"}>Unavailable</Select.Option>
                                <Select.Option value={"Available"}>Available</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item name="floor" label="Floor " className="w-1/3" rules={[{ required: true }]}><Input /></Form.Item>

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
            </Modal >

        </>
    );
}
