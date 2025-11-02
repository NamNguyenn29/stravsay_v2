'use client'
import Link from 'next/link';
import Image from "next/image";
import { useRouter } from 'next/navigation';

export default function Header() {
    const router = useRouter();
    const menu = [
        { name: "HOTEL", href: "/" },
        { name: "OURSERVICE", href: "/ourservice" },
        { name: "EXPERIENCE WITH TRAVSTAY", href: "/experience" },
        { name: "STRAVSTAY DISCOVERTY", href: "/discovery" },
        { name: "CONTACT US", href: "/supportrequest" }
    ];

    const handleClickMemberLogin = (() => {
        router.push("/login");
    })

    const handleClickBooknow = (() => {
        router.push("/booking");
    })

    return (
        <>
            <div className="header-top-bar bg-black px-10">
                <div className="flex items-center">
                    <Link href="/" className="cursor-pointer block w-[150px] mx-auto "><Image src={"/logo.png"} alt='stravstaylogo' width={150} height={150} /></Link>
                    <div className='font-semibold text-white text-right pr-[5px] cursor-pointer my-auto relative 
                                    after:content-[""]
                                    after:absolute 
                                    after:left-0
                                    after:bottom-0
                                    after:w-0
                                    hover:after:w-full
                                    after:h-[3px]
                                    after:bg-white
                                    after:transition-all
                                    after:duration-300 
                    '
                        onClick={handleClickMemberLogin} >MEMBER LOGIN</div>
                </div>
            </div>

            <div className="flex items-center justify-between w-full px-24 bg-white">
                <div></div>
                <nav>
                    <ul className="flex gap-10 items-center">
                        {menu.map((item) => (
                            <li key={item.name}>
                                <Link href={item.href} className="font-semibold text-lg text-black relative 
                                after:content-[''] 
                                after:absolute
                                after:left-0
                                after:bottom-0
                                after:w-0
                                hover:after:w-full
                                after:h-[4px]
                                after:bg-rose-500
                                after:transition-all
                                after:duration-300
                                py-2
                                ">{item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="w-40 h-20 bg-rose-500 transform -skew-x-12 flex items-center justify-center text-xl hover:bg-blue-950 hover:!text-rose-500 group ">
                    <span className='cursor-pointer skew-x-12 text-white font-semibold group-hover:text-yellow-400 ' onClick={handleClickBooknow}>Book Now</span>
                </div>
            </div >
        </>
    );
}