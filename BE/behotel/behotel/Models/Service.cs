using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace behotel.Models
{
    public class Service
    {
        [Key]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Service name is required.")]
        [MaxLength(100, ErrorMessage = "Service name cannot exceed 100 characters.")]
        public string Name { get; set; }
        [MaxLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
        public string Description { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        [Range(0, double.MaxValue, ErrorMessage = "Price must be a non-negative value.")]
        public decimal Price { get; set; }
        [Range(0, 1, ErrorMessage = "Status must be 0 (inactive) or 1 (active).")]
        public int Status { get; set; }
        [Required]
        public DateTime CreatedDate { get; set; }
    }
}
