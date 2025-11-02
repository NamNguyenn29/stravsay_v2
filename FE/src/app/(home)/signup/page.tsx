"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/api/UserApi/register";
import { RegisterModel } from "@/model/RegisterModel";
import { embed } from "framer-motion/client";
import { notification } from "antd";


export default function SignupPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [accepted, setAccepted] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [registerModel, setRegisteModel] = useState<RegisterModel>();
    const [api, contextHolder] = notification.useNotification();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password || !confirmPassword) {
            setError("Please fill in all required fields.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!accepted) {
            setError("You must accept the Terms and Privacy Policy.");
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 800);

        try {
            const registerModel: RegisterModel = {
                email: email,
                password: password,
            };

            const res = await registerUser(registerModel);
            console.log("Register response:", res);

            if (res.isSuccess) {
                api.success({
                    message: "Please check your email!",
                    description: "Create user successfully",
                    placement: "topRight",
                    duration: 10
                });

                await new Promise((resolve) => setTimeout(resolve, 1000));
                router.push("/login");
            } else {
                setError(res.message || "Registration failed.");
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
                {/* Left side: background with overlay text */}
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

                {/* Right side: signup form */}
                <div className="flex w-full md:w-1/2 justify-center items-center bg-gray-50 px-6">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md border border-gray-100"
                    >
                        <h2 className="text-3xl font-bold mb-6 text-center !text-white">
                            Create your account
                        </h2>

                        {error && (
                            <div className="mb-5 text-sm text-red-700 bg-red-50 border border-red-100 rounded-md p-3 text-center">
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="email@example.com"
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter a password"
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Confirm password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>

                        {/* Terms */}
                        {/* Terms (aligned) */}
                        <div className="flex items-center text-sm text-gray-700 mb-6">
                            <input
                                type="checkbox"
                                checked={accepted}
                                onChange={(e) => setAccepted(e.target.checked)}
                                className="mr-2 accent-blue-600 focus:ring-blue-500"
                            />
                            <span>
                                I accept Travstay’s{" "}
                                <Link href="#" className="text-blue-700 hover:text-blue-900">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link href="#" className="text-blue-700 hover:text-blue-900">
                                    Privacy Policy
                                </Link>
                            </span>
                        </div>
                        {/* Create Account button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 !text-white font-semibold py-2.5 rounded-md shadow-md transition-all"
                        >
                            {loading ? "Creating..." : "Create account"}
                        </button>

                        {/* Bottom link (with balanced spacing) */}
                        <div className="mt-8">
                            <p className="text-center text-sm text-gray-700">
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="text-blue-700 hover:text-blue-900 font-medium"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
