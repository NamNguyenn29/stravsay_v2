using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace behotel.Models
{
    public class Discount
    {
        [Key]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Discount code is required.")]
        [MaxLength(50, ErrorMessage = "Discount code cannot exceed 50 characters.")]
        public required string DiscountCode { get; set; }
        [Column(TypeName = "decimal(5,2)")]
        [Range(0, 100, ErrorMessage = "Discount value must be between 0 and 100 percent.")]
        public decimal DiscountValue { get; set; }
        [Required(ErrorMessage = "Start date is required.")]
        public DateTime StartDate { get; set; }
        [Required(ErrorMessage = "Start date is required.")]
        public DateTime ExpiredDate { get; set; }
        [Range(0, double.MaxValue, ErrorMessage = "Minimum order amount must be non-negative.")]
        public Decimal MinOrderAmount { get; set; }
        [Range(1, int.MaxValue, ErrorMessage = "Max usage must be at least 1.")]
        public int MaxUsage { get; set; }
        [Range(0, 1, ErrorMessage = "Status must be 0 (inactive) or 1 (active).")]
        public int Status { get; set; }
        [Required]
        public DateTime CreatedDate { get; set; }

    }
}
