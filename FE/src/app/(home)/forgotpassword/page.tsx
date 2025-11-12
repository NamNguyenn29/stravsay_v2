"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { userService } from "@/services/userService";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSent(false);

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await userService.forgotPassword(email);
      setMessage(res.data.message);
      setSent(true);
    } catch {
      setError("Failed to send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left: background image (same as login/signup) */}
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

      {/* Right: form */}
      <div className="flex w-full md:w-1/2 justify-center items-center bg-gray-50 px-6">
        <form
          onSubmit={handleSubmit}
          /* width kept same (w-96), but internal spacing improved via space-y */
          className="bg-white p-10 rounded-2xl shadow-lg w-96 border border-gray-100"
        >
          {/* Use vertical spacing between blocks */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Forgot your password?
            </h2>

            <p className="text-sm text-gray-600">
              Enter your email address and we’ll send you a verification code to reset your password.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            {sent && (
              <div className="p-3 rounded-md bg-green-50 border border-green-100 text-sm text-green-800">
                {message}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 !text-white font-semibold
                           py-3 rounded-md shadow-sm transition-all"
                disabled={loading}
              >
                {loading ? "Sending..." : "Continue"}
              </button>
            </div>

            <div className="text-sm text-center">
              <Link href="/login" className="text-gray-900 font-medium hover:underline">
                ← Back to sign in
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
