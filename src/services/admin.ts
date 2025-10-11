// src/services/admin.ts
/**
 * Service layer for admin dashboard.
 * - Export types so page & components can import the same shapes.
 * - Provide functions that will call backend later. For now they return mock/fallback data.
 *
 * NOTE (Tiếng Việt): Khi backend sẵn sàng, thay URL trong API_BASE or implement fetchJSON
 * để gọi API thật. Function sẽ trả về dữ liệu phù hợp với UI.
 */

export interface TrendPoint {
  day: string; // e.g. "2025-10-05" or "05 Oct"
  value: number;
}

export interface DashboardStats {
  users: number;
  bookings: number;
  revenue: number;
  occupancyPercent?: number;
}

export interface BookingRow {
  id: string;
  guest: string;
  room: string;
  dates: string;
  status: "confirmed" | "pending" | "cancelled";
  total: number;
}

export interface SupportRequest {
  id: string;
  title: string;
  status: "open" | "closed";
}

/** Base URL for admin API — change when backend ready */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api/admin";

/** Utility: safe fetch + json parse. Replace or enhance with axios if preferred. */
async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} - ${txt}`);
  }

  return res.json() as Promise<T>;
}

/**
 * getDashboardData
 * - SHOULD call backend endpoint that returns stats/trend/recentBookings/supportRequests.
 * - For now it returns mock data so UI works without backend.
 *
 * When backend is ready: uncomment fetchJSON line and ensure backend returns matching shape.
 */
export async function getDashboardData(): Promise<{
  stats: DashboardStats;
  trend: TrendPoint[];
  recentBookings: BookingRow[];
  supportRequests: SupportRequest[];
}> {
  // TODO: replace with real API call when available:
  // return fetchJSON(`${API_BASE}/dashboard`);

  // mock fallback (used while building static UI)
  return {
    stats: {
      users: 1242,
      bookings: 342,
      revenue: 12840000,
      occupancyPercent: 72,
    },
    trend: [
      { day: "01 Sep", value: 5 },
      { day: "05 Sep", value: 12 },
      { day: "10 Sep", value: 9 },
      { day: "15 Sep", value: 16 },
      { day: "20 Sep", value: 13 },
      { day: "25 Sep", value: 18 },
      { day: "30 Sep", value: 15 },
    ],
    recentBookings: [
      { id: "TRV-1001", guest: "Nguyen A", room: "Deluxe Sea View", dates: "12 Aug - 14 Aug", status: "confirmed", total: 1850000 },
      { id: "TRV-1002", guest: "Le B", room: "Standard City View", dates: "15 Aug - 16 Aug", status: "pending", total: 850000 },
      { id: "TRV-1003", guest: "Pham C", room: "Suite", dates: "20 Aug - 22 Aug", status: "cancelled", total: 0 },
    ],
    supportRequests: [
      { id: "SR-204", title: "Guest can't check in", status: "open" },
      { id: "SR-206", title: "Payment verification", status: "open" },
      { id: "SR-210", title: "Broken AC in room 101", status: "open" },
    ],
  };
}

/** Smaller helpers if you want separate calls later */
export async function getStats(): Promise<DashboardStats> {
  // TODO: return fetchJSON(`${API_BASE}/stats`);
  const data = await getDashboardData();
  return data.stats;
}

export async function getTrend(): Promise<TrendPoint[]> {
  // TODO: return fetchJSON(`${API_BASE}/trend`);
  const data = await getDashboardData();
  return data.trend;
}

export async function getRecentBookings(): Promise<BookingRow[]> {
  // TODO: return fetchJSON(`${API_BASE}/bookings?limit=10`);
  const data = await getDashboardData();
  return data.recentBookings;
}

export async function getSupportRequests(): Promise<SupportRequest[]> {
  // TODO: return fetchJSON(`${API_BASE}/support?status=open`);
  const data = await getDashboardData();
  return data.supportRequests;
}
