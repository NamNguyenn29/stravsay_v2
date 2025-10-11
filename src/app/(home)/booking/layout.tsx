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
import MyBooking from "@/components/MyBooking";
import { useEffect, useState } from "react";
import { Room } from "@/model/Room";

export default function BookingLayout({ children }: { children: React.ReactNode }) {
    const { RangePicker } = DatePicker;
    const [datedif, setDatedif] = useState<number>(0);
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
    const items: MenuProps['items'] = [
        { key: "1", label: "Strav Single Room" },
        { key: "2", label: "Strav Double Room" },
        { key: "3", label: "Strav Deluxe" },
        { key: "4", label: "Strav Twin Deluxe" },
        { key: "5", label: "Strav City View" },
    ];
    const handleMenuClick: MenuProps["onClick"] = (e) => {
        const selected = items?.find(
            (item) => item && item.key === e.key
        ) as Exclude<MenuProps["items"], undefined>[number];
        if (selected && "label" in selected && selected.label) {
            setRoomType(String(selected.label));
        }
    };
    const handleChangeDate = (
        values: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null,
        dateStrings: [string, string]
    ) => {
        if (values) {
            setCheckInDate(dateStrings[0]);
            setCheckOutDate(dateStrings[1]);
        } else {
            setCheckInDate(null);
            setCheckOutDate(null);
        }
    };
    // xu ly su kien chon adult va children
    const handleAdultChange: InputNumberProps['onChange'] = (value) => {
        setAdult(value as number);
    }
    const handleChildrenChange: InputNumberProps['onChange'] = (value) => {
        setChildren(value as number);
    }

    useEffect(() => {
        if (checkInDate && checkOutDate) {
            const start = new Date(checkInDate);
            const end = new Date(checkOutDate);

            // Tính số ngày chênh lệch (đơn vị: ms → ngày)
            const diffTime = end.getTime() - start.getTime();
            const diffDays = diffTime / (1000 * 60 * 60 * 24);

            setDatedif(diffDays);
        } else {
            setDatedif(0);
        }
    }, [checkInDate, checkOutDate]);


    return (
        <div>
            <div className="text-center text-5xl text-white bg-black font-semibold  p-10">Booking Room</div>
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
                                    {roomType || "Select Room"}
                                </div>
                            </Dropdown>


                            <FontAwesomeIcon icon={faLocationDot} size="xs" color="black" className="pl-4" />

                        </div>
                    </div>
                    <div className="relative text-xl">
                        <label className="text-xl block text-left text-amber-500">Check in - Check Out</label>
                        <div className="cursor-pointer flex justify-between items-center bg-white text-black text-xl mt-2">
                            <RangePicker size="large"
                                defaultValue={[dayjs(checkInDate), dayjs(checkOutDate)]}
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
                            <InputNumber min={1} max={10} defaultValue={noAdult || 2} onChange={handleAdultChange} />
                            <span className=" text-black pl-2 pr-5">  Adult{noAdult || 2 > 1 ? "s" : ""}</span>
                            <InputNumber min={0} max={10} defaultValue={noChildren || 0} onChange={handleChildrenChange} />
                            <span className=" text-black pl-2 pr-5"> Child{children || 0 > 1 ? "ren" : ""}</span>
                            <FontAwesomeIcon icon={faUserFriends} size="xs" color="black" />
                        </div>
                    </div>

                    <div
                        className="bg-rose-500 text-2xl/15 text-white font-semibold px-5 text-center h-15 cursor-pointer hover:bg-blue-900 flex items-center justify-center"
                    >
                        Filter Now
                    </div>
                </div>
                <div className="grid grid-cols-12 container mx-auto py-20 px-20 bg-[rgb(250,247,245)] gap-10">
                    <div className="col-span-9 space-y-10">{children}</div>
                    <div className="col-span-3">
                        <div className="sticky top-5">
                            <MyBooking
                                datedif={datedif}
                                room={room as Room}
                                start={new Date(checkInDate as string)}
                                end={new Date(checkOutDate as string)}
                                guest={(noAdult as number) + (noChildren as number)}
                            />
                        </div>
                    </div>
                </div>


            </div>
            /   </div>
    )
}