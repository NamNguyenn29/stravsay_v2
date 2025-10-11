// src/components/admin/AdminChart.tsx
"use client";

/**
 * AdminChart.tsx
 * - Client-only chart component using @ant-design/plots (dynamically imported).
 * - Exports default AdminChart (trend chart) and OccupancyCard.
 *
 * NOTE (Tiếng Việt): cài package nếu chưa có:
 *   npm i @ant-design/plots
 *
 * AdminChart expects `data: { day: string; value: number }[]`.
 */

import React from "react";
import dynamic from "next/dynamic";
import { Card, Spin, Empty, Progress } from "antd";
import type { TrendPoint } from "@/services/admin";

const Column = dynamic(() => import("@ant-design/plots").then((m) => m.Column), { ssr: false });

type Props = {
  data: TrendPoint[];
  title?: string;
  height?: number;
  loading?: boolean;
  onPointClick?: (p: TrendPoint) => void;
};

export default function AdminChart({
  data,
  title = "Reservation Trend (Last 30 days)",
  height = 220,
  loading = false,
  onPointClick,
}: Props) {
  if (loading) {
    return (
      <Card title={title} style={{ borderRadius: 10, minHeight: height }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height }}>
          <Spin />
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card title={title} style={{ borderRadius: 10, minHeight: height }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height }}>
          <Empty description="No data" />
        </div>
      </Card>
    );
  }

  // Column config for @ant-design/plots
  const config = {
    data,
    xField: "day",
    yField: "value",
    smooth: true,
    padding: "auto" as const,
    height,
    xAxis: { label: { autoRotate: false } },
    yAxis: { nice: true },
    tooltip: { showMarkers: false },
    interactions: [{ type: "marker-active" }],
    color: "#0f172a",
    columnStyle: { radius: [6, 6, 0, 0] },
    // attach click handler if provided
    // @ts-ignore
    onReady: (plot: any) => {
      if (!onPointClick || !plot) return;
      plot.on("element:click", (ev: any) => {
        try {
          const datum = ev.data?.data;
          if (datum) onPointClick({ day: datum.day, value: datum.value });
        } catch {
          /* ignore */
        }
      });
    },
  };

  return (
    <Card title={title} style={{ borderRadius: 10 }}>
      {/* @ts-ignore dynamic import */}
      <Column {...config} />
    </Card>
  );
}

/** Occupancy card component */
export function OccupancyCard({ percent = 0, title = "Occupancy" }: { percent?: number; title?: string }) {
  return (
    <Card title={title} style={{ borderRadius: 10 }}>
      <div style={{ display: "flex", justifyContent: "center", padding: 16 }}>
        <Progress
          type="circle"
          percent={Math.round(Math.max(0, Math.min(100, percent)))}
          size={140}  
          strokeColor={{ "0%": "#34d399", "100%": "#06b6d4" }}
        />

      </div>
    </Card>
  );
}
