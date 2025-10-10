"use client";
import "../css/globals.css";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import "../css/globals.css";
import { useBookingStore } from "@/store/useBookingStore";
import { useRouter } from "next/navigation";
import { DatePicker } from 'antd';
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import type { InputNumberProps } from 'antd';
import { InputNumber } from 'antd';
import "antd/dist/reset.css";
export default function Home() {
  const router = useRouter();
  const { RangePicker } = DatePicker;



  const {
    roomType,
    checkInDate,
    checkOutDate,
    adult,
    children,
    setRoomType,
    setCheckInDate,
    setCheckOutDate,
    setAdult,
    setChildren,
  } = useBookingStore();
  // item cho room type dropdown
  const items: MenuProps['items'] = [
    { key: "1", label: "Strav Single Room" },
    { key: "2", label: "Strav Double Room" },
    { key: "3", label: "Strav Deluxe" },
    { key: "4", label: "Strav Twin Deluxe" },
    { key: "5", label: "Strav City View" },
  ];
  // xu ly su kien chon item trong dropdown
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const selected = items?.find(
      (item) => item && item.key === e.key
    ) as Exclude<MenuProps["items"], undefined>[number];
    if (selected && "label" in selected && selected.label) {
      setRoomType(String(selected.label));
    }
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
        <div className="mx-[20px] mt-40 h-[120px] bg-white flex justify-center gap-20 p-[50px] k h-[180px] ">
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
              <RangePicker size="large" style={{
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
              <span className=" text-black pl-2 pr-5"> {adult || 2} Adult{adult || 2 > 1 ? "s" : ""}</span>
              <InputNumber min={0} max={10} defaultValue={0} onChange={handleChildrenChange} />
              <span className=" text-black pl-2 pr-5">{children || 0} Child{children || 0 > 1 ? "ren" : ""}</span>
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
    </div>
  );
}
