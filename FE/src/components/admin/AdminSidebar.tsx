"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Menu, Button } from "antd";
import type { MenuProps } from "antd";
import { useRouter } from "next/navigation";
import {
  DashboardOutlined,
  UserOutlined,
  HomeOutlined,
  FileTextOutlined,
  TagOutlined,
  SettingOutlined,
  LogoutOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { userService } from "@/services/userService";

interface AdminMenuItem {
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface AdminSidebarProps {
  selectedKey?: string;
}

const MENU: AdminMenuItem[] = [
  { key: "/admin", label: "Dashboard", href: "/admin", icon: <DashboardOutlined /> },
  { key: "/admin/profile", label: "Profile", href: "/admin/profile", icon: <UserOutlined /> },
  { key: "/admin/bookings", label: "Bookings", href: "/admin/bookings", icon: <UnorderedListOutlined /> },
  { key: "/admin/rooms", label: "Rooms", href: "/admin/rooms", icon: <HomeOutlined /> },
  { key: "/admin/users", label: "Users", href: "/admin/users", icon: <UserOutlined /> },
  { key: "/admin/requests", label: "Requests", href: "/admin/requests", icon: <FileTextOutlined /> },
  { key: "/admin/reviews", label: "Reviews", href: "/admin/reviews", icon: <FileTextOutlined /> },
  { key: "/admin/discounts", label: "Discounts", href: "/admin/discounts", icon: <TagOutlined /> },
  { key: "/admin/settings", label: "Settings", href: "/admin/settings", icon: <SettingOutlined /> },
  { key: "/admin/logs", label: "System Logs", href: "/admin/logs", icon: <FileTextOutlined /> },
];

function toAntdItems(items: AdminMenuItem[]): MenuProps["items"] {
  return items.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: (
      <Link href={item.href} style={{ textDecoration: "none", color: "inherit" }}>
        {item.label}
      </Link>
    ),
  }));
}

export default function AdminSidebar({ selectedKey }: AdminSidebarProps) {
  const items = useMemo(() => toAntdItems(MENU), []);
  const router = useRouter();

  const handleLogout = async () => {
    const result = await userService.logOut();
    if (result.data.isSuccess) {
      sessionStorage.setItem("justLoggedOut", "true");
      router.push("/login");
    }
  };

  return (
    <aside
      style={{
        width: 260,
        minHeight: "100vh",
        background: "#fff",
        borderRight: "1px solid #f0f0f0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: 16,
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 8,
            background: "#456d8dff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            color: "#fff",
          }}
        >
          AD
        </div>
        <div>
          <div style={{ fontWeight: 700, color: "#04090eff" }}>Admin Panel</div>
          <div style={{ fontSize: 12, color: "#888" }}>Admin</div>
        </div>
      </div>

      <div style={{ padding: 8, flex: 1, overflowY: "auto" }}>
        <Menu
          mode="inline"
          items={items}
          selectedKeys={selectedKey ? [selectedKey] : []}
          style={{ borderRight: "none" }}
        />
      </div>

      <div style={{ padding: 12, borderTop: "1px solid #f0f0f0" }}>
        <Button
          type="text"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{ width: "100%", textAlign: "left" }}
        >
          Logout
        </Button>
      </div>
    </aside>
  );
}
