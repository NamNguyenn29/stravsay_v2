using behotel.Models;

namespace behotel.DTO
{
    public class BookingDTO
    {
        public Guid Id { get; set; }
        public Guid BookingId { get; set; }
        public Guid ServiceId { get; set; }
        public int Quantity { get; set; }
        public int Status { get; set; }
        public DateTime CreatedDate { get; set; }

        public List<Booking> Bookings { get; set; }
        public List<Service> Services { get; set; }
    }
}
