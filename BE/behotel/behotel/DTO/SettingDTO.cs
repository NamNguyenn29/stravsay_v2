using System.ComponentModel.DataAnnotations;
namespace behotel.DTO
{
    public class SettingDTO
    {
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Contact email is required")]
        [MaxLength(200)]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string ContactEmail { get; set; }

        [Required(ErrorMessage = "Contact phone is required")]
        [MaxLength(50)]
        [Phone(ErrorMessage = "Invalid phone format")]
        public string ContactPhone { get; set; }

        [Required(ErrorMessage = "Address is required")]
        [MaxLength(500)]
        public string Address { get; set; }

        [Required]
        [Range(0, 1, ErrorMessage = "Status must be 0 or 1")]
        public int Status { get; set; }

        public DateTime UpdatedDate { get; set; }
    }
}