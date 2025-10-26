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
import { getRoomType } from "@/api/getRoomType";
import { RoomType } from "@/model/RoomType";
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
  useEffect(() => {
    loadRoomType();
  }, [])
  const loadRoomType = async () => {
    const data = await getRoomType();
    const list: RoomType[] = data.list;

    setRoomTypes(list);

    const mappedItems: MenuProps["items"] = list.map(rt => ({
      key: rt.id.toString(),
      label: rt.typeName,

    }));

    setItems(mappedItems);
  }


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
      {/* ===: Experiences + Promotions === */}
      <div className="bg-gray-50 px-6 py-24">
        {/* Experiences (zig-zag trapezoids) */}
        <section className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-6">The TravStay Experience</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover unique experiences that make your stay memorable.
          </p>

          <div className="space-y-8">
            {/* Row 1: two trapezoids side-by-side */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left trapezoid (slanted left) */}
              <div className="relative overflow-hidden">
                <img
                  src="experiences/experience1.jpg"
                  alt="Stay24"
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "320px",
                    objectFit: "cover",
                    clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)",
                  }}
                  className="transition-transform duration-500 hover:scale-105"
                />
                <div className="mt-4 pl-2">
                  <div className="text-sm font-semibold">STAY24</div>
                  <div className="text-xs text-gray-500">Check in anytime, check out anytime</div>
                </div>
              </div>

              {/* Right trapezoid (slanted right) */}
              <div className="relative overflow-hidden">
                <img
                  src="experiences/experience2.jpg"
                  alt="24/7 Services"
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "320px",
                    objectFit: "cover",
                    clipPath: "polygon(0 0, 92% 0, 100% 100%, 8% 100%)",
                  }}
                  className="transition-transform duration-500 hover:scale-105"
                />
                <div className="mt-4 pl-2">
                  <div className="text-sm font-semibold">24/7 SERVICES</div>
                  <div className="text-xs text-gray-500">Trav Bar, Grab & Go, Co-working spaces</div>
                </div>
              </div>
            </div>

            {/* Row 2: centered larger trapezoid */}
            <div className="flex justify-center">
              <div className="w-full md:w-3/4 relative overflow-hidden">
                <img
                  src="experiences/experience3.jpg"
                  alt="Tech-driven comfort"
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "360px",
                    objectFit: "cover",
                    clipPath: "polygon(12% 0, 88% 0, 100% 100%, 0 100%)",
                  }}
                  className="transition-transform duration-500 hover:scale-105"
                />
                <div className="mt-4 pl-2">
                  <div className="text-sm font-semibold">TECH-DRIVEN COMFORT</div>
                  <div className="text-xs text-gray-500">Smart rooms, digital keys, seamless booking</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Promotions */}
        <section className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-6">Current Promotions</h3>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Limited-time deals to help you save on your next stay.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                img: "promotions/promo1.jpg",
                title: "All-in-One Golf Vacation Package",
                desc: "Perfect golf getaway with premium amenities.",
              },
              {
                img: "promotions/promo2.jpg",
                title: "Dining Voucher for Every Night",
                desc: "Receive daily F&B credit during your stay.",
              },
              {
                img: "promotions/promo3.jpg",
                title: "Free Massage & Airport Shuttle",
                desc: "Relax with a massage and enjoy complimentary transfer.",
              },
            ].map((p, idx) => (
              <article key={idx} className="bg-white rounded-2xl shadow-md overflow-hidden group">
                <div className="relative overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 text-left">
                  <h4 className="font-semibold text-lg mb-2">{p.title}</h4>
                  <p className="text-sm text-gray-600 mb-4">{p.desc}</p>
                  <div className="flex items-center justify-between">
                    <a href="#" className="text-rose-500 font-medium hover:underline">
                      View details →
                    </a>
                    <button
                      type="button"
                      className="bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600 transition"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

    </div>

  );
}
