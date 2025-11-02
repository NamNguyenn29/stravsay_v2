using System.ComponentModel.DataAnnotations;

namespace behotel.Models
{
    public class BookingService
    {
        [Key]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "BookingId is required.")]
        public Guid BookingId { get; set; }
        [Required(ErrorMessage = "ServiceId is required.")]
        public Guid ServiceId { get; set; }
        [Range(1, 100, ErrorMessage = "Quantity must be between 1 and 100.")]
        public int Quantity { get; set; }
        [Range(0, 1, ErrorMessage = "Status must be 0 (inactive) or 1 (active).")]
        public int Status { get; set; }
        [Required]
        public DateTime CreatedDate { get; set; }


    }
}
