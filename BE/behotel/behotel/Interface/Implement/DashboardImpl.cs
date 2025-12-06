using behotel.DTO;
using behotel.DTOs;
using behotel.Interface;
using behotel.Models;
using Microsoft.EntityFrameworkCore;

namespace behotel.Interface.Implement
{
    public class DashboardImpl : IDashboardService
    {
        private readonly HotelManagementContext _context;

        public DashboardImpl(HotelManagementContext context)
        {
            _context = context;
        }

        public async Task<DashboardDTO> GetDashboardDataAsync()
        {
            var today = DateTime.Today;
            var thirtyDaysAgo = today.AddDays(-30);

            // 1. Stats
            var todayBookings = await _context.Booking
                .CountAsync(b => b.CreatedDate.Date == today);

            var totalRooms = await _context.Room.CountAsync();
            var occupiedRooms = await _context.Booking
                .CountAsync(b => b.CheckInDate <= DateTime.Now
                    && b.CheckOutDate >= DateTime.Now
                    && b.Status == 1);

            var totalRevenue = await _context.Booking
                .Where(b => b.CreatedDate >= thirtyDaysAgo && b.Status == 1)
                .SumAsync(b => (decimal?)b.Price) ?? 0;

            var avgRating = await _context.Review
                .AverageAsync(r => (double?)r.Rating) ?? 0;

            var stats = new DashboardStatsDTO
            {
                Bookings = todayBookings,
                TotalRevenue = totalRevenue,
                AvgRating = Math.Round(avgRating, 1)
            };

            // 2. Trend (30 days)
            var bookingsRaw = await _context.Booking
         .Where(b => b.CreatedDate >= thirtyDaysAgo)
         .Select(b => new { b.CreatedDate })
         .ToListAsync();

            var bookingsByDay = bookingsRaw
                .GroupBy(b => b.CreatedDate.Date)
                .ToDictionary(g => g.Key, g => g.Count());

            var trend = bookingsByDay
                .Select(kvp => new TrendPointDTO
                {
                    Day = kvp.Key.ToString("dd MMM"),
                    Value = kvp.Value
                })
                .OrderBy(x => DateTime.ParseExact(x.Day, "dd MMM", System.Globalization.CultureInfo.InvariantCulture))
                .ToList();

            var todayStr = today.ToString("dd MMM");
            if (!trend.Any(t => t.Day == todayStr))
            {
                trend.Add(new TrendPointDTO
                {
                    Day = todayStr,
                    Value = 0
                });
            }

            trend = trend
                .OrderBy(x => DateTime.ParseExact(x.Day, "dd MMM", System.Globalization.CultureInfo.InvariantCulture))
                .ToList();


            // 3. Recent Bookings - Dùng Join với UserId
            var recentBookings = await (from b in _context.Booking
                                        join u in _context.User on b.UserId equals u.Id
                                        join r in _context.Room on b.RoomId equals r.Id
                                        orderby b.CreatedDate descending
                                        select new BookingDTO
                                        {
                                            Id = b.Id,
                                            FullName = u.FullName ?? "Unknown",
                                            Phone = u.Phone ?? "",
                                            RoomNumber = r.RoomNumber,
                                            RoomName = r.RoomName,
                                            CheckInDate = b.CheckInDate,
                                            CheckOutDate = b.CheckOutDate,
                                            Price = b.Price,
                                            discountCode = null, 
                                            Status = b.Status,
                                            CreatedDate = b.CreatedDate,
                                            Adult = b.Adult,
                                            Children = b.Children
                                        })
                                       .Take(10)
                                       .ToListAsync();

            // 4. Support Requests 
            var supportRequests = await (from sr in _context.SupportRequest
                                         join u in _context.User on sr.UserEmail equals u.Email
                                         where sr.Status == 0 // Open = 0
                                         orderby sr.CreatedDate descending
                                         select new NewSupportRequest
                                         {
                                             UserEmail = sr.UserEmail,
                                             Title = sr.Title,
                                             Description = sr.Description
                                         })
                                        .Take(10)
                                        .ToListAsync();

            return new DashboardDTO
            {
                Stats = stats,
                Trend = trend,
                RecentBookings = recentBookings,
                SupportRequests = supportRequests
            };
        }
    }
}