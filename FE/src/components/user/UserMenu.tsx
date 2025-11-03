'use client';
import "../../css/globals.css"
import { Avatar } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { message } from "antd";
import { User } from "@/model/User";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/model/DecodedToken";
import { getUserById } from "@/api/UserApi/getUserById";
export default function UserMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {

        decodeTokenAndLoadUser();
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, []);

    const decodeTokenAndLoadUser = async () => {
        const storedToken = sessionStorage.getItem("accessToken");
        if (!storedToken) {
            message.error("Chưa đăng nhập hoặc thiếu token.");
            return;
        }

        const decoded: DecodedToken = jwtDecode(storedToken);

        const rawId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]

        const data = await getUserById(rawId);
        setUser(data.object);

    }

    const handleLogout = () => {
        sessionStorage.removeItem("accessToken");
        router.push('/login')
    }

    // const getInitials = (name: string) => {
    //     return name
    //         .split(" ")               // tách theo dấu cách
    //         .filter(word => word.length > 0)  // bỏ khoảng trắng thừa
    //         .map(word => word[0].toUpperCase()) // lấy chữ cái đầu
    //         .join("");                // nối lại
    // };
    return (
        <>
            <div className="border border-t-black bg-black w-full"></div>
            <div className="grid grid-cols-12  mr-[50px] ">
                <div className="col-start-9 col-span-4 p-6" >
                    <div className="flex items-center justify-end gap-4">
                        <Avatar size={50}>{user?.roleList[0]}</Avatar>
                        <div className='text-left text-xl font-semibold underline cursor-pointer '>{user?.fullName || ""}</div>
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                type="button"
                                className="p-2"
                                aria-label="menu"
                            >
                                <FontAwesomeIcon icon={faBars} size="2xl" />
                            </button>

                            {isOpen && (
                                <div className=" w-[250px] absolute right-0 mt-2 bg-white rounded-md shadow-lg border py-2 z-50">
                                    <div>
                                        <button
                                            onClick={() => router.push("/profile")}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-rose-500"
                                        >
                                            Profile
                                        </button>
                                        <button
                                            onClick={() => router.push("/userbooking")}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-rose-500"
                                        >
                                            My Booking
                                        </button>
                                        <button className="w-full text-left px-4 py-2 hover:gray-100 hover:text-rose-500" onClick={handleLogout}>
                                            Log out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )


}