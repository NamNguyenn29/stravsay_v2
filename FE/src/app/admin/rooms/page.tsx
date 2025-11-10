"use client"
import { useEffect, useState } from "react";
import { Room } from "@/model/Room";
import { getRooms } from "@/api/RoomApi/getRoom";
import { Pagination, Upload } from 'antd';
import { Modal, Form, Input, Select, Button, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { getRoomType } from "@/api/getRoomType";
import { RoomType } from "@/model/RoomType";
import { deleteRoom } from "@/api/RoomApi/deleteRoom";
import "@/css/modal.css"
import { roomService } from "@/services/roomService";


export default function RoomManagement() {

    // get rooms
    const [rooms, setRooms] = useState<Room[]>([]);
    const [totalPage, setTotalPage] = useState(1);
    const [totalElement, setTotalElement] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [createLoaing, setCreateLoading] = useState(false);

    const [formAdd] = Form.useForm();
    const [formEdit] = Form.useForm();


    const loadRoom = async () => {
        const data = await getRooms(currentPage, pageSize);
        setRooms(data.list);
        setTotalPage(data.totalPage ? data.totalPage : 0);
        setTotalElement(data.totalElement);
    }
    useEffect(() => {
        loadRoom();
        loadRoomType();
    }, [currentPage, pageSize]);

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
            roomType: room.roomTypeID,
            floor: room.floor,
            imageUrl: room.imageUrl || [],
            status: room.status
        });
        setEditModalVisible(true);
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
            setCreateLoading(true);
            const values = await formAdd.validateFields();


            const formData = new FormData();

            formData.append("RoomName", values.roomName);
            formData.append("RoomNumber", values.roomNumber);
            formData.append("RoomTypeID", values.roomType);
            console.log(values.roomTypeID)

            formData.append("Status", values.status);
            formData.append("Description", values.description);
            formData.append("Floor", values.floor);


            values.ImageUrl.forEach((file: string | Blob) => {
                formData.append("ImageUrl", file);
            });

            const res = await roomService.createRoom(formData);
            if (res.data.isSuccess) {
                messageApi.success(res.data.message);
            } else {
                messageApi.error(res.data.message);
            }
            setCreateLoading(false);
            setAddModalVisible(false);
            formAdd.resetFields();
            loadRoom();

        } catch (err) {
            messageApi.error("Failed to add room! : " + err);
            setCreateLoading(false);
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










    const getStatusLabel = (status: number) => {
        if (status == 0) {

            return { text: "Unavailable", color: "bg-yellow-500" };
        }
        else if (status == 1) {
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
                        {rooms.map((room, index) => {
                            const status = getStatusLabel(room.status);
                            return (
                                <tr key={room.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-3">{index + 1 + (currentPage - 1) * pageSize}</td>
                                    <td className="px-6 py-3 font-medium text-gray-800"><div>{room.roomName} - {room.roomNumber}</div>
                                    </td>
                                    <td className="px-6 py-3 font-semibold  !text-black text-blue-600">
                                        {room.basePrice?.toLocaleString()} đ
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
                                        {room?.description ? room.description : "-"}
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
                pageSize={pageSize}              // Số item mỗi trang
                total={totalElement}      // Tổng item (có thể là rooms.length hoặc filteredByStatus.length)
                showSizeChanger                      // Cho phép chọn số item/trang
                pageSizeOptions={[5, 10, 20, 50]}    // Tùy chọn số dòng mỗi trang
                onChange={(page, pageSize) => {
                    setCurrentPage(page);
                    setPageSize(pageSize);
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
                    <Button key="save" type="primary" className="bg-blue-600" >Save Changes</Button>
                ]}

            >
                <Form
                    form={formEdit}
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
                                <Select.Option value={0}>Unavailable</Select.Option>
                                <Select.Option value={1}>Available</Select.Option>
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
                    <Form.List name="images">
                        {(fields, { add, remove }) => (
                            <div className="flex flex-col gap-2">
                                {fields.map(({ key, name, ...restField }) => (
                                    <div key={key} className="flex items-center gap-3 mb-3">
                                        <Form.Item
                                            {...restField}
                                            name={name}
                                            valuePropName="fileList"
                                            getValueFromEvent={(e) => e?.fileList}
                                            rules={[{ required: true, message: "Please upload an image!" }]}
                                            className="!mb-0"
                                        >
                                            <Upload
                                                listType="picture-card"
                                                beforeUpload={() => false} // Không upload lên server, chỉ preview local
                                                onPreview={async (file) => {
                                                    let src: string = file.url || "";

                                                    if (!src && file.originFileObj instanceof Blob) {
                                                        src = URL.createObjectURL(file.originFileObj);
                                                    }

                                                    const img = new Image();
                                                    img.src = src;

                                                    const w = window.open(src);
                                                    w?.document.write(img.outerHTML);
                                                }}

                                            >
                                                + Upload
                                            </Upload>
                                        </Form.Item>

                                        <Button danger onClick={() => remove(name)}>Remove</Button>
                                    </div>
                                ))}

                                <Button type="dashed" onClick={() => add()} block>
                                    + Add Image
                                </Button>
                            </div>
                        )}
                    </Form.List>



                </Form>

            </Modal >

            {/*Add room modal*/}
            < Modal
                title={< span className="text-xl font-semibold text-blue-900" > Add Room</span >}
                open={addModalVisible}
                onCancel={handleCancle}
                centered
                footer={
                    [
                        <Button key="cancel" onClick={handleCancle}>Cancel</Button>,
                        <Button key="add" type="primary" className="bg-green-600" onClick={handleAddSubmit}>Add Room</Button>
                    ]}
            >
                <Form form={formAdd} layout="vertical" className="mt-4">
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
                                <Select.Option value={0}>Unavailable</Select.Option>
                                <Select.Option value={1}>Available</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item name="floor" label="Floor " className="w-1/3" rules={[{ required: true }]}><Input /></Form.Item>

                    </div>

                    <div className="mb-2 font-medium">Image URLs</div>
                    <Form.Item label="Images">
                        <Form.List name="ImageUrl">
                            {(fields, { add, remove }) => (
                                <div className="flex flex-col gap-3">

                                    <div className="grid grid-cols-2 gap-3">
                                        {fields.map((field, index) => {
                                            const fileList = formAdd.getFieldValue("ImageUrl") || [];
                                            const file = fileList[index];

                                            return (
                                                <div key={field.key} className="p-3 border rounded-xl bg-gray-50">

                                                    {/* Hidden chứa file */}
                                                    <Form.Item {...field} className="!mb-2">
                                                        <Input type="hidden" />
                                                    </Form.Item>

                                                    {/* Preview */}
                                                    <div className="w-full h-32 border rounded flex items-center justify-center overflow-hidden">
                                                        {file && (
                                                            <img
                                                                src={URL.createObjectURL(file)}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        )}
                                                    </div>

                                                    {/* Upload */}
                                                    <Upload
                                                        accept="image/*"
                                                        showUploadList={false}
                                                        beforeUpload={(fileUpload) => {
                                                            const clone = [...fileList];
                                                            clone[index] = fileUpload;
                                                            formAdd.setFieldsValue({ ImageUrl: clone });
                                                            return false;
                                                        }}
                                                    >
                                                        <Button className="mt-2" block>
                                                            Upload
                                                        </Button>
                                                    </Upload>

                                                    <Button className="mt-2" danger block onClick={() => {
                                                        const clone = [...fileList];
                                                        clone.splice(index, 1);
                                                        formAdd.setFieldsValue({ ImageUrl: clone });
                                                        remove(field.name);
                                                    }}>
                                                        Remove
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <Button type="dashed" block onClick={() => add()}>
                                        + Add Image
                                    </Button>
                                </div>
                            )}
                        </Form.List>
                    </Form.Item>





                </Form>
            </Modal >

        </>
    );
}
