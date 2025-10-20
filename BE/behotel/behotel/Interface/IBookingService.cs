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

        Task<BookingDTO> GetAllBookingInfor(Guid BookingId);
    }
}
