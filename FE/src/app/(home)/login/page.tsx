"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/api/UserApi/loginUser";
import { LoginModel } from "@/model/LoginModel";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/model/DecodedToken";
import { notification } from "antd";
import { useEffect } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        const token = sessionStorage.getItem("accessToken");
        if (token) {
            try {
                const decoded: DecodedToken = jwtDecode(token);
                const exp = decoded.exp; // thời điểm hết hạn (giây)
                const now = Date.now() / 1000; // thời gian hiện tại (giây)

                // Nếu token đã hết hạn
                if (exp && exp < now) {
                    console.warn("Token expired — clearing session");
                    sessionStorage.removeItem("accessToken");
                    router.push("/login");
                    return;
                }

                const rawRole =
                    decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                const roles = Array.isArray(rawRole) ? rawRole : [rawRole];

                if (roles.includes("ADMIN")) {
                    router.push("/admin");
                } else if (roles.includes("USER")) {
                    router.push("/profile"); // hoặc "/userbooking"
                }
            } catch (error) {
                console.error("Invalid token:", error);
                sessionStorage.removeItem("accessToken");
            }
        }
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

            const res = await loginUser(loginModel);
            console.log("Login response:", res);



            if (res.isSuccess && res.object) {
                //  Lưu token vào sessionStorage (client-side)
                const token = res.object;
                if (typeof window !== "undefined") {
                    sessionStorage.setItem("accessToken", token);
                }
                const decoded: DecodedToken = jwtDecode(token);
                console.log(decoded);
                // console.log("Decoded token:", decoded);
                const rawRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                const roles = Array.isArray(rawRole) ? rawRole : [rawRole];

                api.success({
                    message: "Welcome back!",
                    description: "You have successfully logged in.",
                    placement: "topRight",
                });

                await new Promise((resolve) => setTimeout(resolve, 500));

                if (roles.includes("ADMIN")) {
                    router.push("/admin");
                } else if (roles.includes("USER")) {
                    router.push("/userbooking");
                } else {
                    router.push("/");
                }
            } else {
                setError(res.message || "Invalid email or password.");
            }
        } catch (err) {
            console.error(err);
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };


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
                            className={`w-full text-white font-semibold py-2.5 rounded-md shadow-md transition-all ${loading
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

