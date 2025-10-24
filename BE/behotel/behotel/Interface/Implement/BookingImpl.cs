using behotel.DTO;
using behotel.Models;
using Microsoft.EntityFrameworkCore;

namespace behotel.Interface.Implement
{
    public class BookingImpl : IBookingService
    {
        private readonly HotelManagementContext _context;
        public BookingImpl(HotelManagementContext context)
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

        public async Task<BookingDTO> GetBookingDTOByIdAsync(Guid id)
        {
            var bookingOrigin = await _context.Booking.FindAsync(id);
            if(bookingOrigin == null)
            {
                return null;
            }
            var roomBooking = await _context.Room.FindAsync(bookingOrigin.RoomId);
            var userBooking = await _context.User.FindAsync(bookingOrigin.UserId);
            if (roomBooking == null || userBooking == null)
            {
                return null;
            }
            var services = await _context.BookingService.Where(bs => bs.BookingId == id).Join(_context.Service, bs => bs.ServiceId, s => s.Id, (bs, s) => s.Name).ToListAsync();
            var bookingDTO = new BookingDTO();
            bookingDTO.Id = bookingOrigin.Id;
            bookingDTO.FullName = userBooking.FullName;
            bookingDTO.Phone = userBooking.Phone;
            bookingDTO.RoomName = roomBooking.RoomName;
            bookingDTO.RoomNumber = roomBooking.RoomNumber;
            bookingDTO.CheckInDate = bookingOrigin.CheckInDate;
            bookingDTO.CheckOutDate = bookingOrigin.CheckOutDate;
            bookingDTO.Price = bookingOrigin.Price;
            bookingDTO.Status = bookingOrigin.Status;
            bookingDTO.CreatedDate = bookingOrigin.CreatedDate;
            bookingDTO.Services = services;
            return bookingDTO;

         }
    }
}
