using System.ComponentModel.DataAnnotations;
namespace behotel.Models
{
    public class Setting
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        [Required]
        [MaxLength(200)]
        [EmailAddress]
        public string ContactEmail { get; set; }

        [Required]
        [MaxLength(50)]
        [Phone]
        public string ContactPhone { get; set; }

        [Required]
        [MaxLength(500)]
        public string Address { get; set; }

        [Required]
        public int Status { get; set; } = 1;

        [Required]
        public DateTime UpdatedDate { get; set; } = DateTime.Now;
    }
}