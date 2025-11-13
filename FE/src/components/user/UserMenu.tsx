'use client';
import "../../css/globals.css"
import { Avatar } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { message } from "antd";
import { logOut } from "@/api/UserApi/logOut";
import { userService } from "@/services/userService";
export default function UserMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);
    // const [user, setUser] = useState<User | null>(null);
    const [name, setName] = useState("");
    const [role, setRole] = useState("");

    useEffect(() => {
        loadUser();
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

    const loadUser = () => {
        try {
            const userCookie = getCookie("CURRENT_USER");
            if (userCookie) {
                const user = JSON.parse(userCookie);
                setName(user.fullName);
                if (user.roleList.includes("USER")) {
                    setRole("USER");
                }
            }
        } catch (err) {
            console.log(err);
        }
    }


    function getCookie(name: string): string | null {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
    }

    const handleLogout = async () => {
        // const result = await logOut();
        const result = await userService.logOut();
        if (result.data.isSuccess) {
            message.success("Logged out successfully!");
            document.cookie = "CURRENT_USER=; path=/; max-age=0";
            sessionStorage.setItem("justLoggedOut", "true");
            router.push("/login");

        } else {
            message.error("Failed to log out!");
        }
    };


    return (
        <>
            <div className="border border-t-black bg-black w-full"></div>
            <div className="grid grid-cols-12  mr-[50px] ">
                <div className="col-start-9 col-span-4 p-6" >
                    <div className="flex items-center justify-end gap-4">
                        <Avatar size={50}>{role}</Avatar>
                        <div className='text-left text-xl font-semibold underline cursor-pointer '>{name || ""}</div>
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
                                            onClick={() => router.push("/user/profile")}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-rose-500"
                                        >
                                            Profile
                                        </button>
                                        <button
                                            onClick={() => router.push("/user/userbooking")}
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