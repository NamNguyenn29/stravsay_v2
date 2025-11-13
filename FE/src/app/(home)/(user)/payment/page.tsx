"use client";

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Checkbox, Input, Button } from "antd";
import {jwtDecode} from "jwt-decode";

import { getUserById } from "@/api/UserApi/getUserById";
import { paymentServices } from "@/services/paymentService";
import { Service } from "@/model/Service";
import { serviceServices } from "@/services/serviceService";
import { PaymentMethod } from "@/model/PaymentMethod";


interface DecodedToken {
  [key: string]: string | undefined;
  sub?: string;
  userId?: string;
}

export default function CheckoutPage() {
  // ---------------------------
  // Customer Info
  // ---------------------------
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // ---------------------------
  // Payment
  // ---------------------------
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);
  const [loadingMethods, setLoadingMethods] = useState<boolean>(false);
  const [creatingPayment, setCreatingPayment] = useState<boolean>(false);

  // ---------------------------
  // Extra Services
  // ---------------------------
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState<boolean>(true);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  // ---------------------------
  // Load user, payment methods, services
  // ---------------------------
  useEffect(() => {
    loadUser();
    loadPaymentMethods();
    loadServices();
  }, []);

  const loadUser = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) return;

      const decoded = jwtDecode<DecodedToken>(token);
      const rawId =
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
        decoded.sub ||
        decoded.userId;
      if (!rawId) return;

      const res = await getUserById(rawId);
      const u = res?.object;
      if (!u) return;

      setFullName(u.fullName || "");
      setPhone(u.phone || "");
      setEmail(u.email || "");
    } catch (err) {
      console.error("Load user error:", err);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      setLoadingMethods(true);
      const res = await paymentServices.getPaymentMethods();
      const data = res.data; // vì axios trả về { data: PaymentMethod[] }

      if (Array.isArray(data)) {
        setMethods(data);
        if (data.length > 0 && !paymentMethodId) {
          setPaymentMethodId(data[0].paymentMethodID);
        }
      } else {
        console.warn("Unexpected payment methods response:", data);
      }
    } catch (err) {
      console.error("Error loading payment methods:", err);
    } finally {
      setLoadingMethods(false);
    }
  };

  const loadServices = async () => {
    try {
      setLoadingServices(true);
      const res = await serviceServices.getAll();
      const data = res.data;

      if (Array.isArray(data?.list)) {
        setServices(data.list);
      } else {
        setServices([]);
        console.warn("Unexpected service response:", data);
      }
    } catch (err) {
      console.error("Error fetching services:", err);
      setServices([]);
    } finally {
      setLoadingServices(false);
    }
  };

  const toggleService = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const onContinue = async () => {
    if (!fullName || !phone || !email) {
      alert("Please fill in all customer information before continuing.");
      return;
    }

    if (!paymentMethodId) {
      alert("Please select a payment method.");
      return;
    }

    const chosen = methods.find((m) => m.paymentMethodID === paymentMethodId);
    if (!chosen) {
      alert("Selected payment method is not available.");
      return;
    }

    try {
      setCreatingPayment(true);
      const bookingId = "your-booking-guid";
      const amount = 1500000;

      const payload = {
        bookingID: bookingId,
        paymentMethodID: chosen.paymentMethodID,
        amount: amount,
      };

      const res = await paymentServices.createPayment();
      const data: PaymentResponse | any = res.data ?? res;

      const payUrl =
        data.payUrl ?? data.responsePayload ?? data.object?.payUrl ?? data.string ?? null;

      if (payUrl && chosen.code !== "BANK_TRANSFER") {
        window.location.href = payUrl;
        return;
      }

      alert("Payment created successfully. Please follow the instructions.");
    } catch (err) {
      console.error("Payment error:", err);
      alert("Server error when creating payment.");
    } finally {
      setCreatingPayment(false);
    }
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
          <h1 className="text-4xl font-bold text-rose-600 tracking-tight mb-2">Booking Checkout</h1>
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
            <div className="col-span-12">
              <label className="block text-gray-600 font-medium mb-1">Full Name</label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {loadingServices ? (
                <div>Loading services...</div>
              ) : services.length === 0 ? (
                <div className="text-gray-400 col-span-3 text-center">No services available</div>
              ) : (
                services.map((s) => (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    key={s.id}
                    onClick={() => toggleService(s.id)}
                    className={`border rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all ${selectedServiceIds.includes(s.id)
                        ? "border-rose-400 bg-rose-50 shadow-sm"
                        : "border-gray-200 hover:border-rose-100"
                      }`}
                  >
                    <div className="font-medium text-gray-800 text-base">{s.name}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {s.price.toLocaleString()}₫
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 text-2xl font-semibold bg-gradient-to-r from-rose-50 to-white">
            Payment Methods
          </div>
          <div className="p-8 grid grid-cols-4 gap-5">
            {loadingMethods ? (
              <div>Loading payment methods...</div>
            ) : (
              methods.map((m) => (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  key={m.paymentMethodID}
                  onClick={() => setPaymentMethodId(m.paymentMethodID)}
                  className={`border rounded-xl p-6 flex items-center justify-center text-center transition-all ${paymentMethodId === m.paymentMethodID
                      ? "border-rose-400 bg-rose-50 shadow-sm"
                      : "border-gray-200 hover:border-rose-100"
                    }`}
                >
                  <div className="font-medium text-gray-800 text-base">{m.name}</div>
                </motion.button>
              ))
            )}
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-end">
          <Button
            type="primary"
            size="large"
            className="bg-rose-500 hover:bg-rose-600 px-10 py-6 text-lg font-semibold rounded-xl shadow-md"
            onClick={onContinue}
            loading={creatingPayment}
          >
            Continue to Payment
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
