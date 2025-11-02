using behotel.Interface;
using behotel.Models;
using Microsoft.EntityFrameworkCore;
namespace behotel.Interface.Implement
{
    public class InprogressBookingImpl : IInProgressBookingService
    {
        private readonly HotelManagementContext _context;
        public InprogressBookingImpl (HotelManagementContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Booking>?> GetInprogressBookingAsync()
        {
            var bookings = await _context.Booking.ToListAsync();
            var inprogressBookings = bookings
     .Where(b => b.CheckOutDate >= DateTime.Now) // tất cả booking chưa kết thúc
     .ToList();
            return inprogressBookings;
        }

        public async Task<IEnumerable<Booking>?> GetInprogressBookingsForRoom(Guid roomId)
        {
            var bookingsInprogress = await GetInprogressBookingAsync();
            if (bookingsInprogress == null)
            {
                return null;
            }
            var bookingInProgressForRoom = bookingsInprogress.Where(bi => bi.RoomId == roomId).ToList();
            return bookingInProgressForRoom;
        }
    }
}
