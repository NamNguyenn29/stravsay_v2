using behotel.DTO;
using behotel.Models;
namespace behotel.Interface
{
    public interface IBookingService
    {
        Task<IEnumerable<Booking>> GetAllBookingAsync();
        Task<Booking?> GetBookingByIdAsync(Guid id);
        Task<Booking> CreateBookingAsync(Booking booking);

        Task<bool> DeleteBookingAsync(Guid id);

        //Task<BookingDTO> GetAllBookingInfor(Guid BookingId);

        Task<BookingDTO> GetBookingDTOByIdAsync(Guid id);

        Task<IEnumerable<Booking>?> GetInprogressBookingAsync();


        Task<IEnumerable<Booking>?> GetInprogressBookingsForRoom(Guid roomId); 
    }
}
