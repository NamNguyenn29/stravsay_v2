"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Checkbox, Input, Button } from "antd";
import { userService } from "@/services/userService";
import { User } from "@/model/User";
import { paymentServices } from "@/services/paymentService";
import { Service } from "@/model/Service";
import { serviceServices } from "@/services/serviceService";
import { PaymentMethod } from "@/model/PaymentMethod";
import { useBookingStore } from "../../../../store/useBookingStore";
import { BookingService } from "@/services/bookingService";
import { PaymentResponse } from "@/model/PaymentResponse";
import { Payment } from "@/model/Payment";
import { notification } from "antd";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

interface ErrorResponse {
  message?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();

  // Customer Info
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);

  // Payment
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);
  const [loadingMethods, setLoadingMethods] = useState<boolean>(false);
  const [creatingPayment, setCreatingPayment] = useState<boolean>(false);

  // Extra Services
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState<boolean>(true);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  const { room, checkInDate, checkOutDate, totalAmount, setTotalAmount } = useBookingStore();

  const datedif = checkInDate && checkOutDate
    ? Math.ceil(
        (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  useEffect(() => {
    if (!room || !checkInDate || !checkOutDate) return;

    const diffDays = Math.ceil(
      (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const roomTotal = room.basePrice * diffDays;
    const serviceTotal = services
      .filter((s) => selectedServiceIds.includes(s.id))
      .reduce((sum, s) => sum + s.price, 0);

    setTotalAmount(roomTotal + serviceTotal);
  }, [room, checkInDate, checkOutDate, services, selectedServiceIds, setTotalAmount]);

  useEffect(() => {
    loadUser();
    loadPaymentMethods();
    loadServices();
  }, []);

  const loadUser = useCallback(async () => {
    try {
      const res = await userService.getMyUser();
      const u = res.data.object;

      if (!u) return;

      setUser(u);
      setFullName(u.fullName || "");
      setPhone(u.phone || "");
      setEmail(u.email || "");
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      api.error({
        message: "Error",
        description: err.response?.data?.message || "Failed to load user information",
        placement: "topRight",
      });
    }
  }, [api]);

  const loadPaymentMethods = async () => {
    try {
      setLoadingMethods(true);
      const res = await paymentServices.getPaymentMethods();
      const data = res.data;

      if (Array.isArray(data)) {
        setMethods(data);
        if (data.length > 0 && !paymentMethodId) {
          setPaymentMethodId(data[0].paymentMethodID);
        }
      }
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      api.error({
        message: "Error",
        description: err.response?.data?.message || "Failed to load payment methods",
        placement: "topRight",
      });
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
      }
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      api.error({
        message: "Error",
        description: err.response?.data?.message || "Failed to load services",
        placement: "topRight",
      });
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

  const validateInputs = (): boolean => {
    if (!fullName || fullName.trim().length < 3) {
      api.error({
        message: "Validation Error",
        description: "Full name must be at least 3 characters.",
        placement: "topRight",
      });
      return false;
    }

    const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
    if (!phone || !phoneRegex.test(phone)) {
      api.error({
        message: "Validation Error",
        description: "Phone must be a valid Vietnamese phone number.",
        placement: "topRight",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      api.error({
        message: "Validation Error",
        description: "Please enter a valid email address.",
        placement: "topRight",
      });
      return false;
    }

    return true;
  };

  const onContinue = async () => {
    try {
      setCreatingPayment(true);

      if (!room) {
        api.error({
          message: "Error",
          description: "Please select a room before continuing.",
          placement: "topRight",
        });
        setCreatingPayment(false);
        return;
      }

      if (!validateInputs()) {
        setCreatingPayment(false);
        return;
      }

      if (!paymentMethodId) {
        api.error({
          message: "Error",
          description: "Please select a payment method.",
          placement: "topRight",
        });
        setCreatingPayment(false);
        return;
      }

      const bookingPayload = {
        fullName,
        phone,
        roomNumber: String(room.roomNumber),
        roomName: room.roomName,
        roomId: room.id,
        userId: user?.id || "",
        checkInDate: new Date(checkInDate).toISOString(),
        checkOutDate: new Date(checkOutDate).toISOString(),
        price: totalAmount,
        status: 0,
        createdDate: new Date().toISOString(),
        adult: room.adult,
        children: room.children,
        services: selectedServiceIds,
      };

      const bookingRes = await BookingService.createBooking(bookingPayload);
      const booking = bookingRes.data.object;

      if (!booking || !booking.id) {
        api.error({
          message: "Error",
          description: "Failed to create booking.",
          placement: "topRight",
        });
        setCreatingPayment(false);
        return;
      }

      const paymentPayload: Payment = {
        bookingID: booking.id,
        paymentMethodID: paymentMethodId,
        amount: totalAmount,
      };

      const paymentRes = await paymentServices.createPayment(paymentPayload);
      const paymentData: PaymentResponse = paymentRes.data.object;

      if (!paymentData) {
        api.error({
          message: "Error",
          description: "Failed to create payment.",
          placement: "topRight",
        });
        setCreatingPayment(false);
        return;
      }

      const selectedMethod = methods.find((m) => m.paymentMethodID === paymentMethodId);
      const methodCode = selectedMethod?.code?.toUpperCase();

      if (methodCode === "PAY_ON_ARRIVAL") {
        api.success({
          message: "Booking Success!",
          description: "Your booking has been confirmed. Please pay at the reception.",
          placement: "topRight",
          duration: 3,
        });

        setTimeout(() => {
          router.push("/user/userbooking");
        }, 2000);

        setCreatingPayment(false);
        return;
      }

      if (paymentData.payUrl) {
        window.location.href = paymentData.payUrl;
        return;
      }

      api.error({
        message: "Error",
        description: "Payment URL not available. Please try again.",
        placement: "topRight",
      });
      setCreatingPayment(false);
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      
      api.error({
        message: "Error",
        description: err.response?.data?.message || "Error while processing payment.",
        placement: "topRight",
      });

      setCreatingPayment(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100 py-12 px-4 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl w-full space-y-10"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold text-rose-600 tracking-tight mb-2">
              Booking Checkout
            </h1>
            <p className="text-gray-500 text-lg">
              Complete your booking details below to continue to payment.
            </p>
          </div>

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
                  <div className="text-gray-400 col-span-3 text-center">
                    No services available
                  </div>
                ) : (
                  services.map((s) => (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      key={s.id}
                      onClick={() => toggleService(s.id)}
                      className={`border rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all ${
                        selectedServiceIds.includes(s.id)
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

          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 text-2xl font-semibold bg-gradient-to-r from-rose-50 to-white">
              Payment Methods
            </div>
            <div className="p-8 grid grid-cols-3 gap-5">
              {loadingMethods ? (
                <div>Loading payment methods...</div>
              ) : (
                methods.map((m) => (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    key={m.paymentMethodID}
                    onClick={() => setPaymentMethodId(m.paymentMethodID)}
                    className={`border rounded-xl p-6 flex items-center justify-center text-center transition-all ${
                      paymentMethodId === m.paymentMethodID
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
    </>
  );
}