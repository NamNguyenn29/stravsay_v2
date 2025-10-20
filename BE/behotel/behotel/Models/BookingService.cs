namespace behotel.Models
{
    public class BookingService
    {
        public Guid Id { get; set; }
        public Guid BookingId { get; set; }
        public Guid ServiceId { get; set; }
        public int Quantity { get; set; }
        public int Status { get; set; }
        public DateTime CreatedDate { get; set; }


    }
}
