import { Room } from "@/model/Room";
import { Carousel, message } from 'antd';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { TagOutlined } from "@ant-design/icons";

interface MyBookingProps {
    datedif: number;
    start: Date;
    end: Date;
    room?: Room;
    guest?: number;
    isContinue?: boolean;
    totalAmount?: number;
    showTotalPrice?: boolean;
    discountAmount?: number;
    discountCode?: string;
}

export default function MyBooking({
    datedif,
    start,
    end,
    room,
    guest,
    isContinue,
    totalAmount,
    showTotalPrice = false,
    discountAmount = 0,
    discountCode = ""
}: MyBookingProps) {
    const router = useRouter();

    const handleContinue = () => {
        if (!room) {
            message.warning("Please select a room before continuing!");
            return;
        }
        router.push("/user/payment");
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
        });
    };


    const roomPrice = room ? room.basePrice * datedif : 0;
    const servicesPrice = totalAmount ? totalAmount - roomPrice + discountAmount : 0;
    const subtotal = roomPrice + servicesPrice;


    const finalPrice = totalAmount || 0;

    const displayPrice = showTotalPrice
        ? finalPrice
        : room?.basePrice;
    const priceLabel = showTotalPrice
        ? "Total Amount"
        : "Price per night";

    return (
        <div className="col-span-3 border border-gray-200 bg-white rounded-lg shadow-md">

            <div className="bg-[rgb(253,233,230)] p-4 rounded-t-lg font-semibold text-xl">
                My Booking
            </div>


            <div className="p-5">
                <div className="font-semibold bg-[rgb(253,233,230)] p-2 rounded text-center text-xl font-medium mb-4">
                    {datedif} Night{datedif > 1 ? "s" : ""}
                </div>

                <div className="grid grid-cols-2 text-center text-gray-700 text-lg mb-6">
                    <div>
                        <div className="font-semibold">Check-in</div>
                        <div>{formatDate(start)}</div>
                    </div>
                    <div>
                        <div className="font-semibold">Check-out</div>
                        <div>{formatDate(end)}</div>
                    </div>
                </div>

                {room ? (
                    <div className="flex flex-col items-center">
                        <div className="w-[200px] h-[150px] overflow-hidden rounded-lg">
                            <Carousel autoplay dots={false}>
                                {room.imageUrl.map((url, index) => (
                                    <div key={index} className="flex justify-center items-center h-[150px]">
                                        <Image
                                            src={url}
                                            alt={`Room image ${index}`}
                                            width={200}
                                            height={150}
                                            unoptimized
                                            className="object-cover rounded-lg w-[200px] h-[150px]"
                                        />
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                        <div className="text-xl font-semibold">{room.roomName}</div>
                        <div className="text-gray-600 text-lg">
                            Guests: {(guest !== 0) ? guest : (room.adult + room.children)} | {room.bedType}
                        </div>
                        <div className="text-gray-500 text-lg mt-1">
                            {room.space} m²
                        </div>

                        <div className="mt-4 w-full border-t pt-3">
                            {showTotalPrice ? (
                                <div className="space-y-3">

                                    <div className="flex justify-between text-gray-700">
                                        <span className="text-base">Room ({datedif} night{datedif > 1 ? "s" : ""})</span>
                                        <span className="font-medium">{roomPrice.toLocaleString()} đ</span>
                                    </div>

                                    {servicesPrice > 0 && (
                                        <div className="flex justify-between text-gray-700">
                                            <span className="text-base">Services</span>
                                            <span className="font-medium">{servicesPrice.toLocaleString()} đ</span>
                                        </div>
                                    )}


                                    {discountAmount > 0 && discountCode && (
                                        <div className="flex justify-between text-green-600">
                                            <span className="flex items-center gap-1 text-base">
                                                ({discountCode})
                                            </span>
                                            <span className="font-medium">-{discountAmount.toLocaleString()} đ</span>
                                        </div>
                                    )}

                                    <div className="border-t-2 border-gray-300 my-2"></div>

                                    <div className="flex justify-between text-xl font-bold text-rose-500">
                                        <span>Total</span>
                                        <span>{finalPrice.toLocaleString()} đ</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-right">
                                    <div className="text-lg text-gray-500">{priceLabel}</div>
                                    <div className="text-lg mt-2">
                                        <span className="font-semibold text-rose-500">
                                            {displayPrice?.toLocaleString()} đ
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {isContinue && (
                            <div
                                className="bg-rose-400 px-10 py-3 rounded-lg text-white font-bold text-xl cursor-pointer hover:bg-blue-900 mt-4 transition-all"
                                onClick={handleContinue}
                            >
                                Continue
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-gray-500 text-center">No room selected</div>
                )}
            </div>
        </div>
    );
}