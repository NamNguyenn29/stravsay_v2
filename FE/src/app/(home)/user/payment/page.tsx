"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Checkbox, Input, Button, Divider } from "antd";
import {
    CreditCardOutlined,
    BankOutlined,
    CheckCircleOutlined,
    MobileOutlined,
} from "@ant-design/icons";

export default function CheckoutPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [payment, setPayment] = useState<string>("card");

    const services = [
        "Spa",
        "Gym",
        "Laundry",
        "Swimming Pool",
        "Restaurant",
        "Rooftop Bar",
    ];

    const paymentOptions = [
        { key: "card", label: "VISA / MasterCard", icon: <CreditCardOutlined /> },
        { key: "momo", label: "MoMo Wallet", icon: <MobileOutlined /> },
        { key: "bank", label: "Bank Transfer", icon: <BankOutlined /> },
        { key: "hotel", label: "Pay at Hotel", icon: <CheckCircleOutlined /> },
    ];

    const toggleService = (s: string) => {
        setSelectedServices((prev) =>
            prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
        );
    };

    const handleContinue = () => {
        if (!firstName || !lastName || !phone || !email) {
            alert("Please fill in all customer information before continuing.");
            return;
        }
        alert("✅ Proceeding to payment...");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100 py-12 px-4 flex justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-5xl w-full space-y-10"
            >
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-rose-600 tracking-tight mb-2">
                        Booking Checkout
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Complete your booking details below to continue to payment.
                    </p>
                </div>

                {/* Customer Information */}
                <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 text-2xl font-semibold bg-gradient-to-r from-rose-50 to-white">
                        Customer Information
                    </div>
                    <div className="p-8 grid grid-cols-12 gap-6">
                        <div className="col-span-6">
                            <label className="block text-gray-600 font-medium mb-1">First Name</label>
                            <Input
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Enter first name"
                                size="large"
                            />
                        </div>
                        <div className="col-span-6">
                            <label className="block text-gray-600 font-medium mb-1">Last Name</label>
                            <Input
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Enter last name"
                                size="large"
                            />
                        </div>
                        <div className="col-span-6">
                            <label className="block text-gray-600 font-medium mb-1">Phone Number</label>
                            <Input
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+84 123 456 789"
                                size="large"
                            />
                        </div>
                        <div className="col-span-6">
                            <label className="block text-gray-600 font-medium mb-1">Email Address</label>
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@email.com"
                                size="large"
                            />
                        </div>
                        <div className="col-span-12">
                            <Checkbox className="text-gray-600">
                                I agree to receive news and promotional offers from the hotel.
                            </Checkbox>
                        </div>
                    </div>
                </div>

                {/* Extra Services */}
                <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 text-2xl font-semibold bg-gradient-to-r from-rose-50 to-white">
                        Extra Services
                    </div>
                    <div className="p-8">
                        <p className="text-gray-500 mb-5 text-base">
                            Choose additional services for your stay:
                        </p>
                        <div className="grid grid-cols-3 gap-4">
                            {services.map((s) => (
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    key={s}
                                    className={`cursor-pointer border rounded-xl p-4 text-center transition-all ${selectedServices.includes(s)
                                            ? "border-rose-400 bg-rose-50 shadow-sm"
                                            : "border-gray-200 hover:border-rose-200"
                                        }`}
                                    onClick={() => toggleService(s)}
                                >
                                    <span className="text-gray-700 font-medium">{s}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 text-2xl font-semibold bg-gradient-to-r from-rose-50 to-white">
                        Payment Methods
                    </div>
                    <div className="p-8 grid grid-cols-4 gap-5">
                        {paymentOptions.map((p) => (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                key={p.key}
                                onClick={() => setPayment(p.key)}
                                className={`border rounded-xl p-5 flex flex-col items-center justify-center gap-3 transition-all ${payment === p.key
                                        ? "border-rose-400 bg-rose-50 shadow-sm"
                                        : "border-gray-200 hover:border-rose-100"
                                    }`}
                            >
                                <div className="text-3xl text-rose-500">{p.icon}</div>
                                <div className="font-medium text-gray-700 text-sm">{p.label}</div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Continue Button */}
                <div className="flex justify-end">
                    <Button
                        type="primary"
                        size="large"
                        className="bg-rose-500 hover:bg-rose-600 px-10 py-6 text-lg font-semibold rounded-xl shadow-md"
                        onClick={handleContinue}
                    >
                        Continue to Payment
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}