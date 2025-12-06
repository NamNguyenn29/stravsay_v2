"use client";

import React from "react";
import { Card, Statistic, Skeleton } from "antd";

interface AdminStatsCardProps {
  title: string;
  value: number | string;
  loading?: boolean;
}

export default function AdminStatsCard({ title, value, loading }: AdminStatsCardProps) {
  return (
    <Card style={{ borderRadius: 10, minHeight: 100 }}>
      {loading ? (
        <Skeleton active paragraph={{ rows: 1 }} />
      ) : (
        <>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>
            {title}
          </div>
          <Statistic 
            value={value} 
            valueStyle={{ fontSize: 28, fontWeight: 700 }} 
          />
        </>
      )}
    </Card>
  );
}