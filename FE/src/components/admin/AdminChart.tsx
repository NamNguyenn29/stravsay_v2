"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Card, Spin, Empty, Progress } from "antd"; // ← THÊM Progress
import type { TrendPoint } from "@/model/TrendPoint";

const Column = dynamic(
  () => import("@ant-design/plots").then((mod) => mod.Column),
  { ssr: false }
);

interface AdminChartProps {
  data: TrendPoint[];
  loading?: boolean;
}

interface TooltipItem {
  data: TrendPoint;
  value: number;
  color: string;
}

export default function AdminChart({ data, loading = false }: AdminChartProps) {
  if (loading) {
    return (
      <Card title="Reservation Trend (Last 30 days)" style={{ borderRadius: 10 }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 220 }}>
          <Spin />
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card title="Reservation Trend (Last 30 days)" style={{ borderRadius: 10 }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 220 }}>
          <Empty description="No data" />
        </div>
      </Card>
    );
  }

  return (
    <Card title="Reservation Trend (Last 30 days)" style={{ borderRadius: 10 }}>
      <Column
        data={data}
        xField="day"
        yField="value"
        height={220}
        color="#0f172a"
        columnStyle={{ radius: [6, 6, 0, 0] }}
        xAxis={{ label: { autoRotate: false } }}
        yAxis={{ nice: true }}
        tooltip={{
          showMarkers: false,
          customContent: (title: string, items: TooltipItem[] | undefined) => {
            if (!items || items.length === 0) return null;
            const item = items[0];
            if (!item) return null;
            
            const { day, value } = item.data;
            
            return (
              <div style={{
                padding: '12px',
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ 
                  fontWeight: 600, 
                  fontSize: '14px',
                  marginBottom: '4px',
                  color: '#0f172a'
                }}>
                  {day}
                </div>
                <div style={{ 
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#0f172a'
                }}>
                  {value} {value === 1 ? 'booking' : 'bookings'}
                </div>
              </div>
            );
          },
        }}
      />
    </Card>
  );
}

interface OccupancyCardProps {
  percent: number;
}

export function OccupancyCard({ percent }: OccupancyCardProps) {
  const safePercent = Math.round(Math.max(0, Math.min(100, percent)));

  return (
    <Card title="Occupancy" style={{ borderRadius: 10 }}>
      <div style={{ display: "flex", justifyContent: "center", padding: 16 }}>
        <Progress
          type="circle"
          percent={safePercent}
          size={140}
          strokeColor={{ "0%": "#34d399", "100%": "#06b6d4" }}
        />
      </div>
    </Card>
  );
}