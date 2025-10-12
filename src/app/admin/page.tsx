// src/app/admin/page.tsx
"use client";

/**
 * Admin dashboard page (static UI).
 * - This file uses mock/sample data for all displays.
 * - When backend is ready, replace the TODO sections with real fetch calls
 *   using functions from src/services/admin.ts
 *
 * Comments in Vietnamese indicate where to fetch.
 */

import React, { useEffect, useState } from "react";
import { Row, Col, Card, List, Badge } from "antd";
import AdminStatsCard from "@/components/admin/AdminStatsCard";
import AdminChart, { OccupancyCard } from "@/components/admin/AdminChart";
import {
  getDashboardData,
  type DashboardStats,
  type BookingRow,
  type TrendPoint,
  type SupportRequest,
} from "@/services/admin";

export default function AdminPage() {
  // states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // TODO (Tiếng Việt): Khi backend sẵn sàng, gọi getDashboardData() để lấy dữ liệu thật.
    // Ví dụ:
    //  setLoading(true);
    //  getDashboardData().then(res => {
    //    setStats(res.stats);
    //    setTrend(res.trend);
    //    setBookings(res.recentBookings);
    //    setRequests(res.supportRequests);
    //  }).finally(()=>setLoading(false));
    //
    // For now we call the service which currently returns mock fallback (so UI works).
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getDashboardData();
        if (!mounted) return;
        setStats(data.stats);
        setTrend(data.trend);
        setBookings(data.recentBookings);
        setRequests(data.supportRequests);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div style={{ paddingBottom: 24 }}>
      <div style={{ marginBottom: 12 }}>
        <h1 style={{ margin: 0, color: "#101216ff"}}>Welcome back, Admin</h1>
        <div style={{ color: "#6b7280", marginTop: 6 }}>Overview · Today · Quick actions</div>
      </div>

      {/* Statistic cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <AdminStatsCard title="Today's Bookings" value={loading ? undefined : stats?.bookings ?? 0} loading={loading} />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <AdminStatsCard title="Pending Requests" value={loading ? undefined : requests.filter(r=>r.status==="open").length} loading={loading} />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <AdminStatsCard title="Rooms Occupied" value={loading ? undefined : stats?.occupancyPercent ?? 0} loading={loading} />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <AdminStatsCard title="New Reviews (7d)" value={21} loading={loading} />
        </Col>
      </Row>

      {/* Chart + Occupancy */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={16}>
          <AdminChart data={trend} loading={loading} />
        </Col>

        <Col xs={24} md={8}>
          <OccupancyCard percent={stats?.occupancyPercent ?? 0} />
        </Col>
      </Row>

      {/* Recent bookings + Support requests */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={16}>
          <Card title="Recent Bookings" style={{ borderRadius: 10 }}>
            <List
              dataSource={bookings}
              renderItem={(b) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div>{b.guest}</div>
                        <div style={{ fontSize: 12, color: "#888" }}>{b.dates}</div>
                      </div>
                    }
                    description={`${b.room} • ${b.id}`}
                  />
                  <Badge
                    status={b.status === "confirmed" ? "success" : b.status === "pending" ? "processing" : "error"}
                    text={b.status}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title="Pending Support Requests" style={{ borderRadius: 10 }}>
            <div style={{ color: "#6b7280", marginBottom: 8 }}>{requests.length} open tickets</div>
            <List
              dataSource={requests}
              renderItem={(r) => (
                <List.Item>
                  <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <strong>#{r.id}</strong> - {r.title}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
