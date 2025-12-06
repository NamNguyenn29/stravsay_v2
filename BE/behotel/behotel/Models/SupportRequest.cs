using System.ComponentModel.DataAnnotations;

namespace behotel.Models
{
    public class SupportRequest
    {
        [Key]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "User email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        [MaxLength(100)]
        public string UserEmail { get; set; }
        [Required(ErrorMessage = "Title is required.")]
        [MaxLength(150, ErrorMessage = "Title cannot exceed 150 characters.")]
        public string Title { get; set; }
        [Required(ErrorMessage = "Description is required.")]
        [MaxLength(1000, ErrorMessage = "Description cannot exceed 1000 characters.")]
        public string Description { get; set; }
        [Range(0, 3, ErrorMessage = "Status must be between 0 and 3.")]
        public  int Status { get; set; }
        [Required]
        public DateTime CreatedDate { get; set; }
        [MaxLength(2000)]
        public string? Response {  get; set; }

    }
}
