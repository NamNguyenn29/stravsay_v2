'use client';
import UserMenu from "@/components/user/UserMenu";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/model/DecodedToken";
import { motion } from "framer-motion";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [checking, setChecking] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem("accessToken");
        if (!token) {
            sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
            router.replace("/login");
            return;
        }

        try {
            const decoded: DecodedToken = jwtDecode(token);
            const exp = decoded.exp;
            const now = Date.now() / 1000;

            if (exp && exp < now) {
                sessionStorage.removeItem("accessToken");
                router.replace("/login");
                return;
            }

            const rawRole =
                decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            const roles = Array.isArray(rawRole) ? rawRole : [rawRole];

            if (roles.includes("USER")) {
                setIsAuthorized(true);
            } else {
                router.replace("/login");
                return;
            }
        } catch (err) {
            console.error("Invalid token:", err);
            sessionStorage.removeItem("accessToken");
            router.replace("/login");
        } finally {
            setChecking(false);
        }
    }, [router]);

    if (checking) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 via-indigo-200 to-purple-200">
                <motion.div
                    className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
                <motion.span
                    className="ml-4 text-indigo-600 text-xl font-semibold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                >
                    Checking Authorization.....
                </motion.span>
            </div>
        );
    }

    if (!isAuthorized) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <UserMenu />
            {children}
        </motion.div>
    );
}
