using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace behotel.Models
{
    public class Discount
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string DiscountCode { get; set; }

        [Required]
        [Range(0, 100)]
        public decimal DiscountValue { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? MaxDiscountAmount { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime ExpiredDate { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal MinOrderAmount { get; set; }

        [Required]
        [Range(0, 100)]
        public int DiscountUsage { get; set; } = 0;

        [Required]
        public int MaxUsageLimit { get; set; }

        [Required]
        [Range(0, 1)]
        public int Status { get; set; } = 1;

        [Required]
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}