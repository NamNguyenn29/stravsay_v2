// src/components/admin/RecentBookings.tsx
"use client";

import React from "react";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

type BookingRow = {
  id: string;
  guest: string;
  room: string;
  dates: string;
  status: "confirmed" | "pending" | "cancelled";
  total: number;
};

const columns: ColumnsType<BookingRow> = [
  { title: "Booking Code", dataIndex: "id", key: "id" },
  { title: "Guest", dataIndex: "guest", key: "guest" },
  { title: "Room", dataIndex: "room", key: "room" },
  { title: "Dates", dataIndex: "dates", key: "dates" },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (s: BookingRow["status"]) =>
      s === "confirmed" ? <Tag color="green">Confirmed</Tag> : s === "pending" ? <Tag color="gold">Pending</Tag> : <Tag color="red">Cancelled</Tag>,
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    render: (v: number) => new Intl.NumberFormat("vi-VN").format(v) + " đ",
  },
];

export default function RecentBookings({ data }: { data: BookingRow[] }) {
  return (
    <Table<BookingRow>
      rowKey="id"
      columns={columns}
      dataSource={data}
      pagination={false}
      size="middle"
      bordered={false}
      style={{ borderRadius: 10, overflow: "hidden" }}
    />
  );
}
