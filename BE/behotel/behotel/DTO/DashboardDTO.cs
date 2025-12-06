namespace behotel.DTO
{
    public class DashboardDTO
    {
        public DashboardStatsDTO Stats { get; set; }
        public List<TrendPointDTO> Trend { get; set; }
        public List<BookingDTO> RecentBookings { get; set; }  // Tận dụng BookingDTO có sẵn
        public List<NewSupportRequest> SupportRequests { get; set; }  // Tận dụng NewSupportRequest có sẵn
    }
}