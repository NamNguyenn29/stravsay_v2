using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace behotel.Models
{
    public class RoomType
    {
        [Key]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Room type name is required.")]
        [MaxLength(100, ErrorMessage = "Type name cannot exceed 100 characters.")]
        public string TypeName { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        [Range(0, double.MaxValue, ErrorMessage = "Base price must be a non-negative value.")]
        public decimal BasePrice { get; set; }
        public bool HasBreakFast { get; set; }
        [Required(ErrorMessage = "Bed type is required.")]
        [MaxLength(100, ErrorMessage = "Bed type cannot exceed 100 characters.")]
        public string BedType { get; set; }
        [Range(0, 1, ErrorMessage = "Status must be 0 (inactive) or 1 (active).")]
        public int Status { get; set; }
        [Required]
        public DateTime CreatedDate { get; set; }
        [Range(0, 10, ErrorMessage = "Adult number must be between 0 and 10.")]
        public int Children {  get; set; }
        public int Adult {  get; set; }
        [Range(1, 200, ErrorMessage = "Space (in m²) must be between 1 and 200.")]
        public int Space { get; set; }
    }
}
