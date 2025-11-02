'use client';
import { useBookingStore } from "@/store/useBookingStore";
import { useState } from "react";
import { faRotateLeft, faUserFriends, faArrowsLeftRight, faPaw, faWifi, faSnowflake, faBed, faPhone, faUtensils, faMoneyBill, faGift, faDollarSign, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Room } from "@/model/Room";
import { Carousel } from 'antd';
import { Modal, Box } from "@mui/material";
import Button from '@mui/material/Button';
import Image from 'next/image';
import { motion } from "framer-motion";

interface BookingProps {
    rooms?: Room[];
    loading?: boolean;
}

export default function Booking({ rooms = [], loading = false }: BookingProps) {
    const { setRoom } = useBookingStore();
    const [selectedRoomDetail, setSelectedRoomDetail] = useState<Room | null>(null);

    const handleSelectRoom = (room: Room) => {
        setRoom(room);
    }

    // Loading skeleton
    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-10 py-10">
                {Array(3).fill(0).map((_, idx) => (
                    <div key={idx} className="bg-white p-10 rounded-md shadow-md animate-pulse">
                        <div className="h-48 bg-gray-200 mb-4 rounded-lg" />
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="h-4 bg-gray-200 rounded w-1/3 mt-2" />
                    </div>
                ))}
            </div>
        );
    }

    if (!rooms || rooms.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center text-gray-500 text-xl font-semibold py-20"
            >
                No rooms found
            </motion.div>
        );
    }

    return (
        <>
            {rooms.map((room, idx) => (
                <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                >
                    <div className="border border-none bg-white p-10 rounded-md">
                        {/* Main grid */}
                        <div className="grid grid-cols-12 gap-10">
                            <div className="col-span-3 mt-[10[px]]">
                                <Carousel autoplay>
                                    {room.imageUrl.map((url, index) => (
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
                                    <span onClick={() => setSelectedRoomDetail(room)}>Show more</span>
                                    <FontAwesomeIcon icon={faChevronDown} size="lg" />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
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
                </motion.div>
            ))}

            {/* Modal chi tiết */}
            <Modal open={!!selectedRoomDetail} onClose={() => setSelectedRoomDetail(null)}>
                <Box
                    sx={{
                        p: 4,
                        bgcolor: "white",
                        borderRadius: 2,
                        width: 1200,
                        mx: "auto",
                        mt: 5,
                        maxHeight: "90vh",
                        overflowY: "auto",
                    }}
                >
                    <h2 className="text-2xl font-bold mb-4">{selectedRoomDetail?.roomName}</h2>
                    <div className="grid grid-cols-12 gap-6 mb-6">
                        <div className="mx-auto col-span-12 flex gap-4 overflow-x-auto">
                            {selectedRoomDetail?.imageUrl.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`${selectedRoomDetail?.roomName} - ${index + 1}`}
                                    className="w-60 h-40 object-cover rounded-lg shadow-md"
                                />
                            ))}
                        </div>
                        <div className="col-span-12 grid grid-cols-12">
                            <div className="col-span-3">
                                <div className="text-gray-600 italic mb-2 ">
                                    <b>
                                        Accommodates{" "}
                                        {(selectedRoomDetail ? selectedRoomDetail.adult : 0) +
                                            (selectedRoomDetail ? selectedRoomDetail.children : 0)}{" "}
                                        guests
                                    </b>
                                </div>
                                <div className="text-gray-600 mb-2">
                                    <FontAwesomeIcon icon={faArrowsLeftRight} size="lg" className="-rotate-45" />
                                    <b>{selectedRoomDetail?.space}</b> m<sup>2</sup>
                                </div>
                            </div>
                            <div className="col-span-9">
                                <p className="text-gray-700">{selectedRoomDetail?.description}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-6">
                        <span className="bg-gray-100 px-3 py-2 rounded-md"><FontAwesomeIcon icon={faPaw} /> Pet Allowed</span>
                        <span className="bg-gray-100 px-3 py-2 rounded-md"><FontAwesomeIcon icon={faWifi} /> Wi-Fi</span>
                        <span className="bg-gray-100 px-3 py-2 rounded-md"><FontAwesomeIcon icon={faSnowflake} /> Airconditioning</span>
                        <span className="bg-gray-100 px-3 py-2 rounded-md"><FontAwesomeIcon icon={faBed} /> {selectedRoomDetail?.bedType}</span>
                        <span className="bg-gray-100 px-3 py-2 rounded-md"><FontAwesomeIcon icon={faPhone} /> Phone</span>
                    </div>
                    <div className="flex justify-end mt-6">
                        <Button variant="contained" color="error" onClick={() => setSelectedRoomDetail(null)}>
                            Close
                        </Button>
                    </div>
                </Box>
            </Modal>
        </>
    );
}
