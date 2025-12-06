'use client';
import "@/css/globals.css";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import "@/css/globals.css";
import { useBookingStore } from "@/store/useBookingStore";
import { useRouter } from "next/navigation";
import { DatePicker } from 'antd';
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import type { InputNumberProps } from 'antd';
import { InputNumber } from 'antd';
import { useState, useEffect } from "react";
import "antd/dist/reset.css";
import { RoomType } from "@/model/RoomType";
import { roomTypeService } from "@/services/roomTypeService";
import ChatButton from "@/components/home/ChatButton";
import dynamic from "next/dynamic";

const RoomVR = dynamic(() => import("@/components/home/RoomVR"), {
  ssr: false,
});

export default function Home() {
  const router = useRouter();
  const { RangePicker } = DatePicker;



  const {
    roomType,
    checkInDate,
    checkOutDate,
    noAdult,
    noChildren,
    setRoomType,
    setCheckInDate,
    setCheckOutDate,
    setAdult,
    setChildren,
  } = useBookingStore();
  // item cho room type dropdown
  const [items, setItems] = useState<MenuProps["items"]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const loadRoomType = async () => {
    const res = await roomTypeService.getRoomType();
    const list: RoomType[] = res.data.list;

    setRoomTypes(list);

    const mappedItems: MenuProps["items"] = list.map(rt => ({
      key: rt.id.toString(),
      label: rt.typeName,

    }));

    setItems(mappedItems);
  }
  useEffect(() => {
    loadRoomType();
  }, [])



  // xu ly su kien chon item trong dropdown
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const selectedType = roomTypes.find(rt => rt.id.toString() === e.key) || null;
    setRoomType(selectedType);
  };

  // xu ly su kien chon date
  const handleChangeDate = (
    values: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null,
    dateStrings: [string, string]
  ) => {
    if (values) {
      setCheckInDate(dateStrings[0]);
      setCheckOutDate(dateStrings[1]);
    }
  };
  // xu ly su kien chon adult va children
  const handleAdultChange: InputNumberProps['onChange'] = (value) => {
    setAdult(value as number);
  }
  const handleChildrenChange: InputNumberProps['onChange'] = (value) => {
    setChildren(value as number);
  }

  const handleClickFindNow = () => {
    router.push('/booking');
  }


  return (
    <div className="bg-center bg-cover bg-[url('/Slider1.jpg')]">
      <div className="p-25 text-white text-6xl font-semibold text-center bg-black/25">
        <div className="mt-[15ps] mb-[15px]">WELCOME TO TRAVSTAY</div>
        <div>Your Gateway To Great Stays</div>
        <div className="mx-[20px] mt-40 h-[120px] bg-white flex justify-center gap-10 p-[50px] k h-[180px] ">
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
              <RangePicker size="large" defaultValue={[dayjs(checkInDate), dayjs(checkOutDate)]} style={{
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
              <InputNumber min={1} max={10} defaultValue={2} onChange={handleAdultChange} />
              <span className=" text-black pl-2 pr-5"> Adult{noAdult || 2 > 1 ? "s" : ""}</span>
              <InputNumber min={0} max={10} defaultValue={0} onChange={handleChildrenChange} />
              <span className=" text-black pl-2 pr-5"> Child{noChildren || 0 > 1 ? "ren" : ""}</span>
              <FontAwesomeIcon icon={faUserFriends} size="xs" color="black" />
            </div>
          </div>

          <div
            className="bg-rose-500 text-2xl/15 px-5 text-center h-15 cursor-pointer hover:bg-blue-900 flex items-center justify-center"
            onClick={() => handleClickFindNow()}
          >
            Find Now
          </div>
        </div>


      </div>

      {/* === Experiences + Promotions === */}
      <div className="bg-gray-50 px-6 py-24">
        {/* EXPERIENCES */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-4">The TravStay Experience</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover unforgettable stays — where modern comfort meets authentic hospitality.
          </p>

          <div className="space-y-12">
            {/* ROW 1 */}
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Left trapezoid */}
              <div className="relative group">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80"
                  alt="Luxury Rooms"
                  className="w-full h-[340px] object-cover rounded-xl shadow-lg transition-transform duration-500 group-hover:scale-105"
                  style={{
                    clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t via-transparent rounded-xl"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h4 className="text-lg font-semibold">LUXURY ROOMS</h4>
                  <p className="text-sm opacity-90">Designed for ultimate comfort & style</p>
                </div>
              </div>

              {/* Right trapezoid */}
              <div className="relative group">
                <img
                  src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80"
                  alt="Fine Dining"
                  className="w-full h-[340px] object-cover rounded-xl shadow-lg transition-transform duration-500 group-hover:scale-105"
                  style={{
                    clipPath: "polygon(0 0, 92% 0, 100% 100%, 8% 100%)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t via-transparent rounded-xl"></div>
                <div className="absolute bottom-6 left-12 text-white">
                  <h4 className="text-lg font-semibold">FINE DINING</h4>
                  <p className="text-sm opacity-90">World-class cuisine with local flair</p>
                </div>
              </div>
            </div>

            {/* ROW 2 */}
            <div className="flex justify-center">
              <div className="relative w-full md:w-3/4 group">
                <img
                  src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80"
                  alt="Wellness & Spa"
                  className="w-full h-[360px] object-cover rounded-xl shadow-lg transition-transform duration-500 group-hover:scale-105"
                  style={{
                    clipPath: "polygon(10% 0, 90% 0, 100% 100%, 0 100%)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t via-transparent rounded-xl"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h4 className="text-lg font-semibold">WELLNESS & SPA</h4>
                  <p className="text-sm opacity-90">Recharge your body and mind in paradise</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROMOTIONS */}
        <section className="max-w-7xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-4">Current Promotions</h3>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Make your next stay even more rewarding with our exclusive offers.
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                img: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80",
                title: "Early Bird Discount",
                desc: "Book at least 14 days in advance and save up to 25%.",
              },
              {
                img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
                title: "Weekend Getaway",
                desc: "Stay 2 nights and get the 3rd night free on weekends.",
              },
              {
                img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
                title: "Spa & Relax Package",
                desc: "Enjoy complimentary massage and wellness treatments.",
              },
            ].map((promo, i) => (
              <article
                key={i}
                className="bg-white rounded-2xl shadow-md overflow-hidden group hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={promo.img}
                    alt={promo.title}
                    className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-0 group-hover:opacity-100 transition"></div>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-semibold mb-2">{promo.title}</h4>
                  <p className="text-sm text-gray-600 mb-4">{promo.desc}</p>
                  <div className="flex justify-between items-center">

                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
      <div className="flex justify-center my-12">
        <div className="w-full max-w-5xl h-[700px] rounded-xl overflow-hidden shadow-lg">
          <RoomVR />
        </div>
      </div>
      <ChatButton />

    </div>

  );
}
