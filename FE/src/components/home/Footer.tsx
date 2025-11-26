"use client";
import Link from "next/link";
import { TextField, Button } from "@mui/material";
import Image from "next/image";
import { useState, useEffect } from "react";
import { settingService } from "@/services/settingService";
import type { Setting } from "@/model/Setting";

export default function Footer() {
  const [setting, setSetting] = useState<Setting | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const response = await settingService.getSetting();
        if (response.data.isSuccess && response.data.object) {
          setSetting(response.data.object);
        }
      } catch (err) {
        console.error("Failed to load setting:", err);
      }
    };
    fetchSetting();
  }, []);

  const handleSubscribe = async () => {
    if (!email) return;
    setLoading(true);
    // TODO: Call subscribe API
    setTimeout(() => {
      setLoading(false);
      setEmail("");
    }, 1000);
  };

  const quickMenu = [
    { name: "Home", href: "/" },
    { name: "Service", href: "/ourservice" },
    { name: "Our Room", href: "/" },
  ];

  const supportLinks = [
    { name: "FAQ", href: "/faq" },
    { name: "Privacy & Cookies", href: "/privacy" },
    { name: "Sitemap", href: "/sitemap" },
  ];

  const socialLinks = [
    { name: "Facebook", href: "https://facebook.com" },
    { name: "Instagram", href: "https://instagram.com" },
    { name: "Youtube", href: "https://youtube.com" },
  ];

  return (
    <div className="bg-gray-900 text-white">
      <div className="container px-10 py-20 mx-auto">
        <div className="grid grid-cols-6 gap-10">
          {/* Logo & Subscribe */}
          <div className="col-span-2">
            <div className="w-48 cursor-pointer mb-5">
              <Image src="/logo.png" alt="stavstaylogo" width={150} height={150} />
            </div>
            <div className="flex gap-4">
              <TextField
                label="Your Email Address"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  width: "220px",
                  "& .MuiInputBase-input": {
                    textAlign: "center",
                    padding: "12px",
                    color: "white",
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "9999px",
                    "& fieldset": { borderColor: "white" },
                    "&:hover fieldset": { borderColor: "white" },
                    "&.Mui-focused fieldset": { borderColor: "white" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "white",
                    width: "100%",
                    textAlign: "center",
                    left: 0,
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "white" },
                }}
              />
              <Button
                onClick={handleSubscribe}
                disabled={loading}
                sx={{
                  width: 140,
                  borderRadius: "9999px",
                  textAlign: "center",
                  cursor: "pointer",
                  border: "1px solid black",
                  backgroundColor: "#e9bc6eff",
                  color: "black",
                  fontWeight: 500,
                  "&:hover": { backgroundColor: "#685036ff" },
                  "&:disabled": { opacity: 0.5, cursor: "not-allowed" },
                }}
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </Button>
            </div>
          </div>

          {/* Quick Menu */}
          <div className="col-span-1">
            <div className="text-3xl pt-20 mb-7">Quick Menu</div>
            <ul className="text-lg">
              {quickMenu.map((item) => (
                <li key={item.name} className="mb-3">
                  <Link
                    href={item.href}
                    className="relative py-2 text-white after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-white after:transition-all after:duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-1">
            <div className="title text-3xl pt-20 mb-7">Support</div>
            <ul className="text-lg">
              {supportLinks.map((item) => (
                <li key={item.name} className="mb-3">
                  <Link
                    href={item.href}
                    className="relative py-2 text-white after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 hover:after:w-full after:h-[3px] after:bg-white after:transition-all after:duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - Load từ API */}
          <div className="col-span-1">
            <div className="title text-3xl pt-20 mb-7">Contact Info</div>
            <ul className="text-lg">
              {setting && setting.status === 1 ? (
                <>
                  <li className="mb-3">
                    <Link
                      href="#"
                      className="relative py-2 text-white after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-white after:transition-all after:duration-300"
                    >
                      A : {setting.address}
                    </Link>
                  </li>
                  <li className="mb-3">
                    <Link
                      href="#"
                      className="relative py-2 text-white after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-white after:transition-all after:duration-300"
                    >
                      P : {setting.contactPhone}
                    </Link>
                  </li>
                  <li className="mb-3">
                    <Link
                      href={`mailto:${setting.contactEmail}`}
                      className="relative py-2 text-white after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-white after:transition-all after:duration-300"
                    >
                      E : {setting.contactEmail}
                    </Link>
                  </li>
                </>
              ) : (
                <li className="text-gray-400">Contact info unavailable</li>
              )}
            </ul>
          </div>

          {/* Social Site */}
          <div className="col-span-1">
            <div className="title text-3xl pt-20 mb-7">Social Site</div>
            <ul className="text-lg">
              {socialLinks.map((item) => (
                <li key={item.name} className="mb-3">
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative py-2 text-white after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 hover:after:w-full after:h-[3px] after:bg-white after:transition-all after:duration-300"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="my-10 bg-white border-t-1 border-white"></div>
        <div className="grid gird-cols-2 gap-4">
          <div>Copyright © 2024 All rights reserved</div>
          <div className="text-end">Villa & Resort</div>
        </div>
      </div>
    </div>
  );
}