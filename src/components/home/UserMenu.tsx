'use client';
import "../../css/globals.css"
import { Avatar } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function UserMenu() {
    const [isOpnen, setIsOpen] = useState(false);
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
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
    return (
        <>
            <div className="border border-t-black bg-black w-full"></div>
            <div className="grid grid-cols-12  ">
                <div className="col-start-9 col-span-4 p-6" >
                    <div className="flex items-center justify-end gap-4">
                        <Avatar size={50}>USER</Avatar>
                        <div className='text-left text-xl font-semibold underline cursor-pointer '>NA</div>
                        <div className="relative">
                            <button
                                onClick={() => setIsOpen(!isOpnen)}
                                type="button"
                                className="p-2"
                                aria-label="menu"
                            >
                                <FontAwesomeIcon icon={faBars} size="2xl" />
                            </button>

                            {isOpnen && (
                                <div className=" w-[250px] absolute right-0 mt-2 bg-white rounded-md shadow-lg border py-2 z-50">
                                    <div>
                                        <button
                                            onClick={() => router.push("/member")}
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
                                        <button
                                            onClick={() => router.push("/changepassword")}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-rose-500"
                                        >
                                            Change Password
                                        </button>
                                        <button className="w-full text-left px-4 py-2 hover:gray-100 hover:text-rose-500">
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