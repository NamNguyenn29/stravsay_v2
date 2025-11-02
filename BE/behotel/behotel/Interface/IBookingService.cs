using behotel.DTO;
using behotel.Helper;
using behotel.Models;
namespace behotel.Interface
{
    public interface IBookingService
    {
        Task<IEnumerable<Booking>> GetAllBookingAsync();
        Task<Booking?> GetBookingByIdAsync(Guid id);
        Task<ApiResponse<BookingDTO>> CreateBookingAsync(NewBooking newBooking);

        Task<bool> DeleteBookingAsync(Guid id);

        //Task<BookingDTO> GetAllBookingInfor(Guid BookingId);

        Task<BookingDTO> GetBookingDTOByIdAsync(Guid id);


        Task<ApiResponse<BookingDTO>> GetBookingDTOWithPaginationAsync(int currentPage, int pageSize);

       
    }
}
