using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace behotel.Models
{
    public class Booking_Deleted
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid RoomId { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public decimal Price { get; set; }
        public Guid? DiscountID { get; set; }
        public int Status { get; set; }
        public DateTime CreatedDate { get; set; }
        public int Adult { get; set; }
        public int Children { get; set; }
    }
}
