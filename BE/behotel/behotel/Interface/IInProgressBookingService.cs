using behotel.Models;

namespace behotel.Interface
{
    public interface IInProgressBookingService
    {
        Task<IEnumerable<Booking>?> GetInprogressBookingAsync();


        Task<IEnumerable<Booking>?> GetInprogressBookingsForRoom(Guid roomId);
    }
}
