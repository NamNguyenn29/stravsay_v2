using behotel.DTO;
using behotel.Models;
using Microsoft.EntityFrameworkCore;

namespace behotel.Interface.Implement
{
    public class BookingService : IBookingService
    {
        private readonly HotelManagementContext _context;
        public BookingService(HotelManagementContext context)
        {
            _context = context;
        }

        public async Task<Booking> CreateBookingAsync(Booking booking)
        {
            _context.Booking.Add(booking);
            await _context.SaveChangesAsync();
            return booking;


        }

        public async Task<bool> DeleteBookingAsync(Guid id)
        {
            var room = await _context.Booking.FindAsync(id);
            if(room == null)
            {
                return false;
            }
            _context.Booking.Remove(room);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Booking>> GetAllBookingAsync()
        {
            return await _context.Booking.ToListAsync();
        }

        public async Task<BookingDTO> GetAllBookingInfor(Guid BookingId)
        {
            var booking = await _context.Booking.FindAsync(BookingId);
            if (booking == null)
            {
                return null;
            }
            BookingDTO bookingDTO = new BookingDTO();
            // map booking vao bookingDTO

            //tim list booking 

            return null;
        }

        public async Task<Booking?> GetBookingByIdAsync(Guid id)
        {
            var booking = await _context.Booking.FindAsync(id);
            return booking;
        }
    }
}
