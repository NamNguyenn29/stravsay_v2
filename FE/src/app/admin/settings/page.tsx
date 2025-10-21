"use client";

import React from "react";
import { Tabs, Card } from "antd";
import {
  SettingOutlined,
  LockOutlined,
  BellOutlined,
  CalendarOutlined,
  ToolOutlined,
} from "@ant-design/icons";

import GeneralSettings from "@/components/admin/settings/GeneralSettings";
import BookingSettings from "@/components/admin/settings/BookingSettings";
import NotificationSettings from "@/components/admin/settings/NotificationSettings";
import SecuritySettings from "@/components/admin/settings/SecuritySettings";
import SystemSettings from "@/components/admin/settings/SystemSettings";


export default function SettingsPage() {
  const role = "Admin"; // TODO: sau này lấy từ Auth context hoặc middleware

  if (role !== "Admin") {
    return (
      <div className="px-6 py-6">
        <h3 className="text-lg font-medium text-gray-700">No access</h3>
        <p className="text-gray-500">You do not have permission to view this page.</p>
      </div>
    );
  }

  const items = [
    {
      key: "general",
      label: (
        <span>
          <SettingOutlined /> General
        </span>
      ),
      children: <GeneralSettings />,
    },
    {
      key: "booking",
      label: (
        <span>
          <CalendarOutlined /> Booking & Policy
        </span>
      ),
      children: <BookingSettings />,
    },
    {
      key: "notification",
      label: (
        <span>
          <BellOutlined /> Notifications
        </span>
      ),
      children: <NotificationSettings />,
    },
    {
      key: "security",
      label: (
        <span>
          <LockOutlined /> Security
        </span>
      ),
      children: <SecuritySettings />,
    },
    {
      key: "system",
      label: (
        <span>
          <ToolOutlined /> System Preferences
        </span>
      ),
      children: <SystemSettings />,
    },
  ];

  return (
    <div className="px-6 py-6 bg-gray-50 min-h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Settings</h1>
        <div className="w-full h-[2px] bg-black/80 mt-3 mb-6" />
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Card variant="borderless" className="shadow-sm rounded-lg">
          <Tabs
            defaultActiveKey="general"
            type="card"
            size="large"
            items={items}
            tabBarStyle={{ marginBottom: 24 }}
          />
        </Card>
      </div>
    </div>
  );
}
