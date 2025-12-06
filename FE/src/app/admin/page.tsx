"use client";

import React, { useEffect, useState } from "react";
import { Row, Col, Card, List, Badge } from "antd";
import AdminStatsCard from "@/components/admin/AdminStatsCard";
import AdminChart, { OccupancyCard } from "@/components/admin/AdminChart";
import { DashboardService } from "@/services/dashboardService";
import type { DashboardStats } from "@/model/DashboardStats";
import type { BookingRow } from "@/model/BookingRow";
import type { TrendPoint } from "@/model/TrendPoint";
import type { SupportRequest } from "@/model/SupportRequest";

interface BackendBooking {
  id: string;
  fullName: string;
  roomNumber: number;
  roomName: string;
  checkInDate: string;
  checkOutDate: string;
  status: number;
}

interface BackendSupportRequest {
  title: string;
}

type BookingStatus = "pending" | "confirmed" | "cancelled";
type BadgeStatus = "success" | "processing" | "error";

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats>({
    bookings: 0,
    avgRating: 0,
    totalRevenue: 0
  });
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const mapStatus = (status: number): BookingStatus => {
    if (status === 1) return "confirmed";
    if (status === 2) return "cancelled";
    return "pending";
  };

  const getBadgeStatus = (status: BookingStatus): BadgeStatus => {
    if (status === "confirmed") return "success";
    if (status === "cancelled") return "error";
    return "processing";
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const transformBooking = (b: BackendBooking): BookingRow => ({
    id: b.id,
    guest: b.fullName,
    room: `${b.roomName} (${b.roomNumber})`,
    dates: `${formatDate(b.checkInDate)} - ${formatDate(b.checkOutDate)}`,
    status: mapStatus(b.status),
  });

  const transformRequest = (r: BackendSupportRequest, i: number): SupportRequest => ({
    id: `SR-${1000 + i}`,
    title: r.title,
    status: "open",
  });

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const res = await DashboardService.getDashboardData();
        if (!mounted) return;

        const data = res.data.list[0];
        setStats(data.stats);
        setTrend(data.trend);
        setBookings(data.recentBookings.map(transformBooking));
        setRequests(data.supportRequests.map(transformRequest));
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();
    return () => { mounted = false; };
  }, []);

  return (
    <div style={{ paddingBottom: 24 }}>
      <div style={{ marginBottom: 12 }}>
        <h1 style={{ margin: 0, color: "#101216ff" }}>Welcome back, Admin</h1>
        <div style={{ color: "#6b7280", marginTop: 6 }}>
          Overview · Today · Quick actions
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <AdminStatsCard
            title="Today's Bookings"
            value={stats.bookings}
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <AdminStatsCard
            title="Pending Requests"
            value={requests.length}
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <AdminStatsCard
            title="Revenue (30 days)"
            value={formatCurrency(stats.totalRevenue)}
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <AdminStatsCard
            title="Avg Rating"
            value={stats.avgRating.toFixed(1)}
            loading={loading}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={16}>
          <AdminChart data={trend} loading={loading} />
        </Col>

        <Col xs={24} md={8}>
          <OccupancyCard percent={65} />
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={16}>
          <Card title="Recent Bookings" style={{ borderRadius: 10 }}>
            <List
              dataSource={bookings}
              renderItem={(booking) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div>{booking.guest}</div>
                        <div style={{ fontSize: 12, color: "#888" }}>
                          {booking.dates}
                        </div>
                      </div>
                    }
                    description={`${booking.room} • ${booking.id}`}
                  />
                  <Badge
                    status={getBadgeStatus(booking.status)}
                    text={booking.status}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title="Pending Support Requests" style={{ borderRadius: 10 }}>
            <List
              dataSource={requests}
              renderItem={(request) => (
                <List.Item>
                  <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <strong>#{request.id}</strong> - {request.title}
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