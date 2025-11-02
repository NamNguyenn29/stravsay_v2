using behotel.DTO;
using behotel.Helper;
using behotel.Models;
using Microsoft.EntityFrameworkCore;

namespace behotel.Interface.Implement
{
    public class BookingImpl : IBookingService
    {
        private readonly HotelManagementContext _context;
        private readonly IUserService _userService;
        private readonly IRoomService _roomService;
        private readonly IServiceService _serviceService;
        private readonly IDiscountService _discountService;
        public BookingImpl(HotelManagementContext context, IUserService userService, IRoomService roomService, IServiceService serviceService, IDiscountService discountService)
        {
            _context = context;
            _userService = userService;
            _roomService = roomService;
            _serviceService = serviceService;
            _discountService = discountService;
        }

        public async Task<ApiResponse<BookingDTO>> CreateBookingAsync(NewBooking newBooking)
        {
            Guid idGuid = Guid.NewGuid();
            var user = await _userService.GetUserByIdAsync(Guid.Parse(newBooking.UserId));
            if (user == null || user.Status != 1)
            {
                return new ApiResponse<BookingDTO>(null, null, "404", "User not found", false, 0, 0, 0, 0, null, null);
            }
            var roomDTO = await _roomService.GetRoomDTOByIdAsync(Guid.Parse(newBooking.RoomId));
            if (roomDTO == null)
            {
                return new ApiResponse<BookingDTO>(null, null, "404", "Room not found", false, 0, 0, 0, 0, null, null);
            }
            decimal totalServicePrice = 0;
            if (newBooking.services != null)
            {
                foreach (string serviceId in newBooking.services)
                {

                    var service = await _serviceService.GetServiceByIdAsync(Guid.Parse(serviceId));
                    if (service != null)
                    {
                        totalServicePrice += service.Price;
                    }

                }
            }
            decimal discountValue = 1;
            if (newBooking.DiscountID != null)
            {
                var discount = await _discountService.GetDiscountByIdAsync(Guid.Parse(newBooking.DiscountID));
                if (discount != null)
                {
                    discountValue = discount.DiscountValue;
                }
            }
            TimeSpan difference = newBooking.CheckOutDate.Date - newBooking.CheckInDate.Date;
            int totalDays = difference.Days;
            Booking booking = new Booking
            {
                Id = idGuid,
                CheckInDate = newBooking.CheckInDate,
                CheckOutDate = newBooking.CheckOutDate,
                RoomId = roomDTO.Id,
                UserId = user.Id,
                Adult = newBooking.Adult,
                Children = newBooking.Children,
                Status = 0,
                Price = (roomDTO.BasePrice * totalDays + totalServicePrice) * discountValue,
                CreatedDate = DateTime.Now
            };
            if (newBooking.DiscountID != null)
            {
                booking.DiscountID = Guid.Parse(newBooking.DiscountID);
            }
            _context.Booking.Add(booking);
            await _context.SaveChangesAsync();
            var bookingDTO = await GetBookingDTOByIdAsync(booking.Id);
            if (bookingDTO == null)
            {
                return new ApiResponse<BookingDTO>(null, null, "400", "Get booking with information was failed", false, 0, 0, 0, 0, null, null);
            }
            return new ApiResponse<BookingDTO>(null, bookingDTO, "200", "Create bookin successfully", true, 0, 0, 0, 1, null, null);


        }

        public async Task<bool> DeleteBookingAsync(Guid id)
        {
            var room = await _context.Booking.FindAsync(id);
            if (room == null)
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

        //public async Task<BookingDTO> GetAllBookingInfor(Guid BookingId)
        //{
        //    var booking = await _context.Booking.FindAsync(BookingId);
        //    if (booking == null)
        //    {
        //        return null;
        //    }
        //    BookingDTO bookingDTO = new BookingDTO();
        //    // map booking vao bookingDTO

        //    //tim list booking 

        //    return null;
        //}





        public async Task<Booking?> GetBookingByIdAsync(Guid id)
        {
            var booking = await _context.Booking.FindAsync(id);
            return booking;
        }

        public async Task<BookingDTO> GetBookingDTOByIdAsync(Guid id)
        {
            var bookingOrigin = await _context.Booking.FindAsync(id);
            if (bookingOrigin == null)
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
            bookingDTO.Adult = bookingOrigin.Adult;
            bookingDTO.Children = bookingOrigin.Children;
            return bookingDTO;

        }

        public async Task<ApiResponse<BookingDTO>> GetBookingDTOWithPaginationAsync(int currentPage, int pageSize)
        {
            var allBookings = await GetAllBookingAsync();
            if (allBookings.Count() < 1)
            {
                return new ApiResponse<BookingDTO>(null, null, "404", "No booking found", false, 0, 0, 0, 0, null, null);
            }
            var bookingDTOs = new List<BookingDTO>();
            int totalElement = allBookings.Count();
            int totalPage = (int)Math.Ceiling((double)totalElement / pageSize);

            var bookingsWithPagination = allBookings.Skip((currentPage - 1) * pageSize).Take(pageSize).ToList();
            foreach (var booking in bookingsWithPagination)
            {
                BookingDTO bookingDTO = await GetBookingDTOByIdAsync(booking.Id);
                if (bookingDTO != null)
                {
                    bookingDTOs.Add(bookingDTO);

                }
            }
            return new ApiResponse<BookingDTO>(bookingDTOs, null, "200", "Get bookings successfully", true, currentPage, pageSize, totalPage, totalElement, null, null);

        }


    }
}
