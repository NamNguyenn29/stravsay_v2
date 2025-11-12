"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { userService } from "@/services/userService";
import { ResetpasswordModel } from "@/model/ResetPasswordModel";
export default function ChangePasswordPage() {
  const router = useRouter();

  // const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const [checking, setChecking] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  useEffect(() => {
    const checkToken = async () => {


      if (!email || !token) {
        router.push("/forbidden403");
        return;
      }


      try {
        const res = await userService.validateResetToken(email, token);
        if (res.data.isSuccess) {
          setIsValidToken(true);
        } else {
          router.push("/forbidden403");
        }
      } catch (err) {
        router.push("/forbidden403");
      } finally {
        setChecking(false);
      }
    };

    checkToken();
  }, [searchParams, router]);

  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold">
        Validating reset link...
      </div>
    );
  }

  if (!isValidToken) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    setLoading(true);
    const payload: ResetpasswordModel = {
      Email: email ? email : "",
      Password: newPassword,
      ResetToken: token ? token : "",
    }
    const res = await userService.resetPassword(payload);
    if (!res.data.isSuccess) {
      setError(res.data.message);
    } else {
      setSuccess(res.data.message);
      router.push("/login");
    }
    setLoading(false)

  };

  return (
    <div className="flex h-screen">
      {/* Left: same background + overlay as login/signup */}
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

      {/* Right: form card — MATCH styling with login/signup */}
      <div className="flex w-full md:w-1/2 justify-center items-center bg-gray-50 px-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md border border-gray-100"
        >
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center">Change password</h2>

            {/* messages */}
            {error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-md p-3 text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-md p-3 text-center">
                {success}
              </div>
            )}

            {/* Current password */}
            {/* <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Current password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div> */}

            {/* New password */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                New password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Confirm password */}
            <div className="mb-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Confirm password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center mt-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 !text-white font-semibold rounded-md shadow-sm"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>

            {/* bottom link spaced like login */}
            <div className="mt-6 text-sm text-center">
              <Link href="/login" className="text-blue-700 hover:text-blue-900 font-medium">
                ← Back to sign in
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
