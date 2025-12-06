using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace behotel.Models
{
    public class Booking
    {
        [Key]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "UserId is required.")]
        public Guid UserId { get; set; }
        [Required(ErrorMessage = "RoomId is required.")]
        public Guid RoomId { get; set; }
        [Required(ErrorMessage = "Check-in date is required.")]
        public DateTime CheckInDate { get; set; }
        [Required(ErrorMessage = "Check-out date is required.")]
        public DateTime CheckOutDate { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        [Range(0, double.MaxValue, ErrorMessage = "Price must be a non-negative value.")]
        public decimal Price { get; set; }
        public Guid? DiscountID { get; set; }
        [Range(0, 5, ErrorMessage = "Status must be between 0 and 5.")]
        public int Status { get; set; }
        [Required]
        public DateTime CreatedDate { get; set; }
        [Range(1, 10, ErrorMessage = "Adult count must be between 1 and 10.")]
        public int Adult { get; set; }
        [Range(0, 10, ErrorMessage = "Children count must be between 0 and 10.")]
        public int Children { get; set; }
   

        public Room? Room { get; set; }



    }
}
