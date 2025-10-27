"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Menu, Button } from "antd";
import type { MenuProps } from "antd";
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

type AdminMenuItem = {
  key: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: AdminMenuItem[];
  hidden?: boolean;
};

type Props = {
  selectedKey?: string; // truyền URL hiện tại hoặc key để highlight
  collapsed?: boolean; // nếu muốn thu gọn
  onLogout?: () => void; // callback logout
};

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
  return items
    .filter((it) => !it.hidden)
    .map((it) => ({
      key: it.key,
      icon: it.icon,
      label: it.href ? (
        <Link href={it.href} className="admin-sidebar-link">
          {it.label}
        </Link>
      ) : (
        <span>{it.label}</span>
      ),
      children: it.children ? toAntdItems(it.children) : undefined,
    }));
}

export default function AdminSidebar({ selectedKey, collapsed = false, onLogout }: Props) {
  const items = useMemo(() => toAntdItems(MENU), []);

  return (
    <aside
      role="navigation"
      aria-label="Admin sidebar"
      style={{
        width: collapsed ? 80 : 260,
        minHeight: "100vh",
        background: "#fff",
        borderRight: "1px solid #f0f0f0",
        display: "flex",
        flexDirection: "column",
      }}
      className="admin-sidebar"
    >
      {/* Logo / header */}
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
          }}
        >
          AD
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontWeight: 700, color: "#04090eff" }}>Admin Panel</div>
            <div style={{ fontSize: 12, color: "#888" }}>Admin</div>
          </div>
        )}
      </div>

      {/* Menu */}
      <div style={{ padding: 8, flex: 1, overflowY: "auto" }}>
        <Menu
          mode="inline"
          items={items}
          selectedKeys={selectedKey ? [selectedKey] : []}
          style={{ borderRight: "none" }}
        />
      </div>

      {/* Footer: logout */}
      <div style={{ padding: 12, borderTop: "1px solid #f0f0f0" }}>
        <Button
          type="text"
          danger
          icon={<LogoutOutlined />}
          onClick={() => {
            if (onLogout) {
              onLogout();
            } else {
              // default logout: clear token and redirect to /login
              try {
                localStorage.removeItem("token");
              } catch (e) {
                /* ignore */
              }
              window.location.href = "/login";
            }
          }}
          style={{ width: "100%", textAlign: "left" }}
        >
          Logout
        </Button>
      </div>
    </aside>
  );
}
