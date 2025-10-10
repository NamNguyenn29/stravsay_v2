
import { Carousel } from 'antd';
import Image from 'next/image';

export default function UserBooking() {
    // booking mau
    const bookings = [{


        "id": "1",
        "userID": "1",
        "roomID": "1",
        "checkIn": "01/10/2025",
        "checkOut": "05/10/2025",
        "price": 2500000,
        "discountID": 1,
        "status": 1,
        imgUrls: [
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        ],

    },]

    // lay mau va ten cho status
    const getStatusLabel = (status: number) => {
        switch (status) {
            case 0:
                return { text: "Pendding ", color: "bg-yellow-500" }
            case 1:
                return { text: "Approved ", color: "bg-green-500" }
            case 2:
                return { text: "Cancelled ", color: "bg-red-500" }
            default:
                return { text: "Unknown ", color: "bg-gray-500" }
        }
    }

    return (
        <>
            <div className="bg-[rgb(250,247,245)] mx-auto container py-5 rounded-md">
                <div className="text-4xl mx-10">
                    My Bookings
                </div>
                <div className=" border border-b-1 container mx-auto bg-black mt-2 mb-2"></div>

                <div className=" flex justify-start gap-5 container p-10 mb-10 ">
                    <input type="search"
                        placeholder="Search by room, Code, ..."
                        className="w-96 border p-2 rounded-md" />
                    <button
                        type="button"
                        className="bg-rose-500 text-white text-xl font-semibold px-4 py-1 rounded-md hover:bg-blue-600">Search</button>
                </div>
                <div>
                    {bookings.length === 0 ? (
                        <div className="text-center text-2xl font-semibod py-10">No Booking Fount</div>
                    ) : (
                        bookings.map((booking) => {
                            const status = getStatusLabel(booking.status);
                            return (

                                <div key={booking.id} className="my-8 rounded-xl shadow-lg bg-white p-6 hover:shadow-2xl transiton-shadow mx-20">
                                    <div className="flex gap-6  ">
                                        <div className="w-1/3">
                                            <Carousel autoplay>
                                                {booking.imgUrls.map((url, index) => (
                                                    <div key={index}>
                                                        <Image src={url} alt='' width={200} height={200}
                                                            className="w-full h-[200px] object-cover rounded-lg" />
                                                    </div>
                                                ))}
                                            </Carousel>
                                        </div>
                                        <div className='w-2/3 flex flex-col justify-between     '>
                                            <div className='grid grid-cols-2 gap-x-8 gap-y-2'>
                                                <div>
                                                    <h2 className='text-2xl font-bold text-rose-500 mb-2'>{booking?.roomID}</h2>
                                                    <p className="text-gray-700 text-lg mb-2"><span className="font-semibold">Code:</span> {booking.id}</p>
                                                    <p className="text-gray-700 text-lg mb-2"><span className="font-semibold">Guest:</span> {booking?.userID}</p>
                                                    <p className="text-gray-700 text-lg mb-2"><span className="font-semibold">Room:</span> {booking?.roomID}</p>
                                                </div>

                                                <div>
                                                    <p className="text-gray-700 text-lg mb-2 mt-10"><span className="font-semibold">Check-in:</span> {booking.checkIn} - 14:00</p>
                                                    <p className="text-gray-700 text-lg mb-2"><span className="font-semibold">Check-out:</span> {booking.checkOut} - 12:00</p>
                                                    <p className="text-gray-700 text-lg mb-2"><span className="font-semibold">Payment:</span> <span className="text-rose-500">{booking.price.toLocaleString()} đ</span></p>
                                                </div>
                                            </div>

                                            <div className="flex justify-end items-center gap-4 mt-6">
                                                <span
                                                    className={`px-4 py-1 rounded-full text-md font-semibold text-white ${status.color}`} >
                                                    {status.text}
                                                </span>
                                                <button className="px-5 py-2 rounded-md font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                                                    Download Invoice
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>



        </>
    )
}