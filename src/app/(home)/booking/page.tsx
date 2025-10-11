'use client';
import { useBookingStore } from "@/store/useBookingStore";
import { useState, useEffect } from "react";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { faArrowsLeftRight } from "@fortawesome/free-solid-svg-icons/faArrowsLeftRight";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import { faWifi } from "@fortawesome/free-solid-svg-icons";
import { faSnowflake } from "@fortawesome/free-solid-svg-icons";
import { faBed } from "@fortawesome/free-solid-svg-icons";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { faGift } from "@fortawesome/free-solid-svg-icons";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { Room } from "@/model/Room";
import { Carousel } from 'antd';
import Image from 'next/image';
export async function getRooms(): Promise<Room[]> {
    try {
        const res = await fetch("http://localhost:5199/api/Room", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!res.ok) throw new Error("Failed to fetch rooms");
        const data = await res.json();
        console.log("Fetched rooms:", data);
        return data;
    } catch (err) {
        console.error("Error fetching rooms:", err);
        return [];
    }
}
export default function Booking() {
    const { room, setRoom } = useBookingStore();
    const [rooms, setRooms] = useState<Room[]>([]);
    const handleSelectRoom = (room: Room) => {
        setRoom(room);
    }
    useEffect(() => {
        getRooms().then((data) => setRooms(data));
    }, [])
    return (
        <>
            {rooms.map((room) => (
                <div key={room.id} className="border border-none bg-white p-10 rounded-md">
                    <div className="grid grid-cols-12 gap-10">
                        <div className="col-span-3 mt-[10[px]]">
                            <Carousel autoplay>
                                {room.imageURls.map((url, index) => (
                                    <div key={index}>
                                        <Image src={url} alt='' width={250} height={150}
                                            className="w-full h-[200px] object-cover rounded-lg" />
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                        <div className="col-span-9">
                            <div className="text-rose-500 font-semibold underline mb-5">{room.roomName}</div>
                            <div className="mb-5">
                                <span className="bg-[rgb(243,244,246)] p-2 rounded-md">
                                    <FontAwesomeIcon icon={faUserFriends} size="lg" />
                                    <span className="ml-3">Up to {room.adult + room.children} guests</span>
                                </span>
                                <span className="ml-5 bg-[rgb(243,244,246)] p-2 rounded-md">
                                    <FontAwesomeIcon icon={faArrowsLeftRight} size="lg" className="-rotate-45" />
                                    <span className="ml-3">{room.space} m<sup>2</sup></span>
                                </span>
                            </div>
                            <div className="mb-5">
                                <span className="bg-[rgb(243,244,246)] p-2 rounded-md">
                                    <FontAwesomeIcon icon={faPaw} size="lg" />
                                    <span className="ml-3">Pet Allowed</span>
                                </span>
                                <span className="ml-5 bg-[rgb(243,244,246)] p-2 rounded-md">
                                    <FontAwesomeIcon icon={faWifi} size="lg" />
                                    <span className="ml-3">Wi-Fi</span>
                                </span>
                                <span className="ml-5 bg-[rgb(243,244,246)] p-2 rounded-md">
                                    <FontAwesomeIcon icon={faSnowflake} size="lg" />
                                    <span className="ml-3">Aircondition</span>
                                </span>
                            </div>
                            <div>
                                <span className="bg-[rgb(243,244,246)] p-2 rounded-md">
                                    <FontAwesomeIcon icon={faBed} size="lg" />
                                    <span className="ml-3">{room.bedType}</span>
                                </span>
                                <span className="ml-5 bg-[rgb(243,244,246)] p-2 rounded-md">
                                    <FontAwesomeIcon icon={faPhone} size="lg" />
                                    <span className="ml-3">Phone</span>
                                </span>
                                <span className="ml-5 bg-[rgb(243,244,246)] p-2 rounded-md">
                                    <span className="ml-3">+15</span>
                                </span>
                            </div>
                            <div className="mt-10">
                                Birds of a feather stay together in our urban view twin room on a low floor
                            </div>
                            <div
                                className="ml-100 my-10 inline-flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer
                                        text-gray-800 hover:bg-sky-900 hover:text-white transition"
                            >
                                <span>Show more</span>
                                <FontAwesomeIcon icon={faChevronDown} size="lg" />
                            </div>
                        </div>
                    </div>

                    <div className="border-t-1 bg-gray-500"></div>

                    <div className="grid grid-cols-12">
                        <div className="col-span-6 my-10">
                            <div className="text-rose-500 font-semibold mb-3">Room and BreakFast</div>
                            <div className="mb-5">
                                <FontAwesomeIcon icon={faUtensils} size="lg" />
                                <span className="ml-2">Breakfast : <b>Include</b></span>
                            </div>
                            <div className="mb-5">
                                <FontAwesomeIcon icon={faRotateLeft} size="lg" />
                                <span className="ml-2">Cancellation policy</span>
                            </div>
                            <div className="mb-5">
                                <FontAwesomeIcon icon={faMoneyBill} size="lg" />
                                <span className="ml-2">Payment : bank card</span>
                            </div>
                            <div>
                                <FontAwesomeIcon icon={faGift} size="lg" />
                                <span className="ml-2"><b>Include</b>: TRAVSTAY Anytime: 24/7 Perks That {`Don't`} Sleep</span>
                            </div>
                        </div>

                        <div className="col-span-6 my-10">
                            <div className="text-xl font-bold text-right">Price for 1 night</div>
                            <div className="grid grid-cols-12">
                                <div className="col-span-6">
                                    <div>
                                        <span className="border p-2 rounded-md px-4 bg-rose-500 text-white">-10%</span>
                                        <span className="ml-5 text-lg font-semibold line-through">
                                            {room.basePrice.toLocaleString()} đ
                                        </span>
                                        <div className="mt-5 ml-18">
                                            <FontAwesomeIcon icon={faDollarSign} />
                                            <span className="text-lg font-semibold">
                                                {(room.basePrice * 0.9).toLocaleString()} đ
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="ml-25 mt-10 col-span-6 border w-35 text-xl/15 font-semibold h-15 text-center bg-rose-500 rounded-md text-white cursor-pointer"
                                    onClick={() => handleSelectRoom(room)}
                                >
                                    Select
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}