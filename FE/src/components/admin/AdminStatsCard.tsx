// src/components/admin/AdminStatsCard.tsx
"use client";

import React from "react";
import { Card, Statistic, Skeleton } from "antd";

type Props = {
  title: string;
  value?: number | string;
  suffix?: React.ReactNode;
  loading?: boolean;
  description?: string;
};

export default function AdminStatsCard({ title, value, suffix, loading, description }: Props) {
  return (
    <Card style={{ borderRadius: 10, minHeight: 100 }}>
      {loading ? (
        <Skeleton active paragraph={{ rows: 1 }} />
      ) : (
        <>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>{title}</div>
          <Statistic value={value ?? 0} suffix={suffix} valueStyle={{ fontSize: 28, fontWeight: 700 }} />
          {description && <div style={{ marginTop: 8, color: "#6b7280", fontSize: 12 }}>{description}</div>}
        </>
      )}
    </Card>
  );
}
