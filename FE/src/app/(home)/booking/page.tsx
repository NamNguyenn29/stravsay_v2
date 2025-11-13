'use client';
import { useBookingStore } from "../../../store/useBookingStore";
import { Dropdown } from 'antd';
import dayjs from "dayjs";
import type { InputNumberProps } from 'antd';
import { InputNumber } from 'antd';
import type { MenuProps } from 'antd';
import "antd/dist/reset.css";
import { DatePicker } from 'antd';
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import MyBooking from "@/components/user/MyBooking";
import { useEffect, useState } from "react";
import { Room } from "@/model/Room";
import { RoomType } from "@/model/RoomType";
import { SearchRoom } from "@/model/SearchRoom";
import BookingComponent from "@/components/home/BookingComponent";
import { roomTypeService } from "@/services/roomTypeService";
import { roomService } from "@/services/roomService";
export default function BookingPage() {
    const { RangePicker } = DatePicker;
    const [datedif, setDatedif] = useState<number>(0);
    const [items, setItems] = useState<MenuProps["items"]>([]);
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [loading, setLoading] = useState(true);
    const [rooms, setRooms] = useState<Room[]>([]);
    const {
        roomType,
        checkInDate,
        checkOutDate,
        noAdult,
        noChildren,
        room,
        setRoomType,
        setCheckInDate,
        setCheckOutDate,
        setAdult,
        setChildren,
    } = useBookingStore();
    // 🔹 load loại phòng khi khởi tạo
    useEffect(() => {
        loadRoomType();
        loadAvailableRoom();
    }, []);

    const loadRoomType = async () => {
        // const data = await getRoomType();
        const res = await roomTypeService.getRoomType();
        const list: RoomType[] = res.data.list;
        setRoomTypes(list);

        const mappedItems: MenuProps["items"] = list.map(rt => ({
            key: rt.id.toString(),
            label: rt.typeName,
        }));

        setItems(mappedItems);
    };

    // 🔹 load phòng trống khi có thay đổi
    const loadAvailableRoom = async () => {
        setLoading(true);
        const searchRoom: SearchRoom = {
            roomTypeId: roomType?.id ?? null,
            checkInDate: checkInDate.toString(),
            checkOutDate: checkOutDate.toString(),
            noAdult: noAdult || 2,
            noChildren: noChildren || 0,
        };

        // const data = await getAvailableRoom(searchRoom);
        const res = await roomService.getAvailableRoom(searchRoom);
        setRooms(res.data.list);
        setLoading(false);
    };

    // Khi thay đổi ngày hoặc loại phòng thì gọi lại API
    useEffect(() => {
        if (roomType && checkInDate && checkOutDate) {
            loadAvailableRoom();
        }
    }, [roomType, checkInDate, checkOutDate]);

    const handleMenuClick: MenuProps["onClick"] = (e) => {
        const selectedType = roomTypes.find(rt => rt.id.toString() === e.key) || null;
        setRoomType(selectedType);
    };

    const handleChangeDate = (
        values: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null,
        dateStrings: [string, string]
    ) => {
        if (values) {
            setCheckInDate(dateStrings[0]);
            setCheckOutDate(dateStrings[1]);
        }
    };

    const handleAdultChange: InputNumberProps['onChange'] = (value) => {
        setAdult(value as number);
    };
    const handleChildrenChange: InputNumberProps['onChange'] = (value) => {
        setChildren(value as number);
    };
    const handleFilter = () => {
        loadAvailableRoom(); // hoặc nếu muốn rooms không đổi, chỉ update guest thì gọi store setAdult/setChildren
    };

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
                <div className="mx-[20px]  h-[120px] bg-white flex justify-start gap-20 p-[50px] k h-[180px] ">
                    <div className="relative text-xl">
                        <label className="text-xl block text-left text-amber-500">Room</label>
                        <div className="cursor-pointer flex justify-between items-center bg-white text-black text-xl mt-[15px]">
                            <Dropdown
                                menu={{
                                    items,
                                    onClick: handleMenuClick
                                }}
                                placement="bottomLeft"
                                trigger={["click"]}
                            >
                                <div className="text-xl cursor-pointer bg-white">
                                    {roomType ? roomType.typeName : "Select Room"}
                                </div>
                            </Dropdown>


                            <FontAwesomeIcon icon={faLocationDot} size="xs" color="black" className="pl-4" />

                        </div>
                    </div>
                    <div className="relative text-xl">
                        <label className="text-xl block text-left text-amber-500">Check in - Check Out</label>
                        <div className="cursor-pointer flex justify-between items-center bg-white text-black text-xl mt-2">
                            <RangePicker size="large"
                                value={[dayjs(checkInDate), dayjs(checkOutDate)]}
                                style={{
                                    color: "black ",
                                    fontSize: "24px",
                                    fontWeight: "bold",
                                    border: "none",

                                }} onChange={handleChangeDate} />

                        </div>
                    </div>
                    <div className="relative text-xl ">
                        <label className="text-xl block text-left text-amber-500">Guest</label>
                        <div className="cursor-pointer flex justify-between items-center bg-white text-black text-xl mt-4">
                            <InputNumber min={1} max={10} value={noAdult} onChange={handleAdultChange} />
                            <span className=" text-black pl-2 pr-5">  Adult{noAdult || 2 > 1 ? "s" : ""}</span>
                            <InputNumber min={0} max={10} value={noChildren} onChange={handleChildrenChange} />
                            <span className=" text-black pl-2 pr-5"> Child{noChildren || 0 > 1 ? "ren" : ""}</span>
                            <FontAwesomeIcon icon={faUserFriends} size="xs" color="black" />
                        </div>
                    </div>

                    <div
                        className="bg-rose-500 text-2xl/15 text-white font-semibold px-5 text-center h-15 cursor-pointer hover:bg-blue-900 flex items-center justify-center"
                        onClick={handleFilter}
                    >
                        Filter Now
                    </div>
                </div>
                <div className="grid grid-cols-12 container mx-auto py-20 px-20 bg-[rgb(250,247,245)] gap-10">
                    <div className="col-span-9 space-y-10"><BookingComponent rooms={rooms} loading={loading} /></div>
                    <div className="col-span-3">
                        <div className="sticky top-5">
                            <MyBooking
                                datedif={datedif}
                                room={room as Room}
                                start={new Date(checkInDate as string)}
                                end={new Date(checkOutDate as string)}
                                guest={(noAdult as number) + (noChildren as number)}
                                isContinue={true}
                            />
                        </div>
                    </div>
                </div>


            </div>
            /   </div>
    )
}