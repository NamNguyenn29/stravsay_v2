"use client";

import React from "react";
import Link from "next/link";

interface AdminHeaderProps {
  brand?: string;
  href?: string;
}

export default function AdminHeader({ brand = "STRAVSTAY", href = "/" }: AdminHeaderProps) {
  return (
    <header
      style={{
        background: "#0f2130",
        color: "#ffffff",
        height: 77,
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.02)",
      }}
    >
      <div style={{ 
        width: "100%", 
        maxWidth: 1400, 
        margin: "0 auto", 
        padding: "0 20px" 
      }}>
        <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
          <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: 0.5 }}>
            {brand}
          </span>
        </Link>
      </div>
    </header>
  );
}
