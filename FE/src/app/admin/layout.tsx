// src/app/admin/layout.tsx
import React from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";

export const metadata = {
  title: "Admin - Dashboard",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#f5f7fa" }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <AdminHeader />
        <main style={{ padding: 24, display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}>{children}</div>
        </main>
      </div>
    </div>
  );
}
