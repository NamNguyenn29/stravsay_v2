"use client";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import "../css/globals.css";
import { useBookingStore } from "@/store/useBookingStore";
import { useRouter } from "next/navigation";
import { DatePicker } from 'antd';
export default function Home() {
  const router = useRouter();
  const { RangePicker } = DatePicker;
  const handleClick = () => {
    router.push("/booking");
  }

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


  return (
    <div className="bg-center bg-cover bg-[url('/Slider1.jpg')]">
      <div className="p-25 text-white text-6xl font-semibold text-center bg-black/25">
        <div className="mt-20 mb-15">WELCOME TO TRAVSTAY</div>
        <div>Your Gateway To Great Stays</div>
        <div className="mx-20 mt-40 h-[120px] bg-white flex justify-center gap-20 p-8">
          <div className="relative text-xl">
            <label className="text-xl block text-left text-amber-500">Room</label>
            <div className="cursor-pointer flex justify-between items-center bg-white text-black text-xl mt-2">
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
            <label className="text-xl block text-left text-amber-500">Room</label>
            <div className="cursor-pointer flex justify-between items-center bg-white text-black text-xl mt-2">
              <RangePicker size="large" style={{ color: "black" }} />

            </div>
          </div>

          <div className="text-black" onClick={() => handleClick()}>a</div>
        </div>


      </div>
    </div>
  );
}
