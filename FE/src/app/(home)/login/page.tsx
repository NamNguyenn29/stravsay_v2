"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/api/UserApi/loginUser";
import { LoginModel } from "@/model/LoginModel";
import { notification } from "antd";
import { GetMyUser } from "@/api/UserApi/GetMyUser";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { userService } from "@/services/userService";


export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const justLoggedOut = sessionStorage.getItem("justLoggedOut");
        if (justLoggedOut) {
            sessionStorage.removeItem("justLoggedOut");
            setChecking(false);
            return;
        }

        const userCookie = getCookie("CURRENT_USER");
        if (userCookie) {
            const user = JSON.parse(userCookie);
            if (user.roleList.includes("ADMIN")) {
                router.replace("/admin");
                return;
            } else if (user.roleList.includes("USER")) {
                router.replace("/user/profile");
                return;
            } else {
                router.replace("/");
                return;
            }
            return;
        }
        setChecking(false);
    }, [router]);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }

        setLoading(true);
        try {
            const loginModel: LoginModel = {
                email,
                password,
                roles: []
            };

            // const res = await loginUser(loginModel);
            const res = await userService.loginUser(loginModel);

            if (res.data.isSuccess && res.data.object) {
                const resGetUser = await GetMyUser();
                if (resGetUser.isSuccess && resGetUser.object) {
                    const jsonString = JSON.stringify(resGetUser.object);

                    document.cookie = `CURRENT_USER=${encodeURIComponent(jsonString)}; path=/; max-age=${1 * 60 * 60}`;
                    await new Promise(r => setTimeout(r, 100)); // 
                }

                api.success({
                    message: "Welcome back!",
                    description: "You have successfully logged in.",
                    placement: "topRight",
                });

                const redirectUrl = getCookie("redirectAfterLogin");
                if (redirectUrl != null) {
                    document.cookie = "redirectAfterLogin=; path=/; max-age=0";
                    router.push(redirectUrl);
                    return;
                }
                if (resGetUser.object?.roleList.includes("ADMIN")) {
                    router.replace("/admin");
                } else if (resGetUser.object?.roleList.includes("USER")) {
                    router.replace("/user/profile");
                } else {
                    router.replace("/");
                }

            } else {
                setError(res.data.message || "Invalid email or password.");
            }
        } catch (err) {
            console.error(err);
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };
    function getCookie(name: string): string | null {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
    }
    if (checking) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white">
                <motion.div
                    className="relative flex justify-center items-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 120, damping: 15 }}
                >
                    <motion.div
                        className="w-20 h-20 border-4 border-t-transparent border-white rounded-full animate-spin"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                    />
                    <motion.span
                        className="absolute text-xl font-semibold"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        Loading
                    </motion.span>
                </motion.div>
                <motion.p
                    className="mt-6 text-sm tracking-widest uppercase text-white/80"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    Checking
                </motion.p>
            </div>
        );
    }
    return (
        <>
            {contextHolder}
            <div className="flex h-screen">
                {/* Left side - background image */}
                <div
                    className="hidden md:flex w-1/2 bg-cover bg-center"
                    style={{ backgroundImage: "url('/login.jpg')" }}
                >
                    <div className="w-full h-full bg-black/30 flex items-center justify-center">
                        <h1 className="text-white text-3xl font-semibold tracking-wide drop-shadow-lg">
                            Welcome to Hotel Booking
                        </h1>
                    </div>
                </div>

                {/* Right side - login form */}
                <div className="flex w-full md:w-1/2 justify-center items-center bg-gray-50 px-6">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md border border-gray-100"
                    >
                        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
                            Welcome back!
                        </h2>

                        {error && (
                            <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md p-3 text-center">
                                {error}
                            </div>
                        )}

                        {/* Email field */}
                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-800">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="email@example.com"
                                required
                            />
                        </div>

                        {/* Password field */}
                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-800">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        {/* Remember & Forgot password */}
                        <div className="flex items-center justify-between mb-7 text-sm text-gray-700">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="mr-2 accent-blue-600 focus:ring-blue-500"
                                />{" "}
                                Remember me
                            </label>
                            <Link
                                href="/forgotpassword"
                                className="text-blue-700 hover:text-blue-900 font-medium"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Login button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full !text-white font-semibold py-2.5 rounded-md shadow-md transition-all ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {loading ? "Logging in..." : "Log in"}
                        </button>

                        {/* Signup link */}
                        <div className="mt-8">
                            <p className="text-center text-sm text-gray-700">
                                Don’t have an account?{" "}
                                <Link
                                    href="/signup"
                                    className="text-blue-700 hover:text-blue-900 font-medium"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

