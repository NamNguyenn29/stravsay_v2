export interface BookingRow {
  id: string;
  guest: string;
  room: string;
  dates: string;
  status: "pending" |"confirmed" |  "cancelled";
}