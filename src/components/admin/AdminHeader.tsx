"use client";

import React from "react";
import Link from "next/link";

type Props = {
  brand?: string;            // chữ hiện ở bên trái, default "STRAVSTAY"
  href?: string;             // link khi click brand
  height?: number;           // chiều cao header (px)
  bg?: string;               // background color
  textColor?: string;        // màu chữ
};

export default function AdminHeader({
  brand = "STRAVSTAY",
  href = "/",
  height = 77,
  bg = "#0f2130",           
  textColor = "#ffffff",
}: Props) {
  return (
    <header
      role="banner"
      aria-label="Admin header"
      style={{
        background: bg,
        color: textColor,
        height,
        display: "flex",
        alignItems: "center",
        boxShadow: "none",
        borderBottom: "1px solid rgba(255,255,255,0.02)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 1400, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
          <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: 0.5 }}>
            {brand}
          </span>
        </Link>

        {/* giữ khoảng trống để có thể thêm các item (search, user) ở phải nếu cần */}
        <div style={{ flex: 1 }} />

        {/* nếu muốn thêm avatar / nút: bỏ comment và tuỳ chỉnh */}
        {/* <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#aab3bf', fontSize: 14 }}>Admin User</span>
        </div> */}
      </div>
    </header>
  );
}
