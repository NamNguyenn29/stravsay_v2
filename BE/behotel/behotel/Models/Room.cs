using System.ComponentModel.DataAnnotations;

namespace behotel.Models
{
    public class Room
    {
        [Key]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Room name is required.")]
        [MaxLength(100, ErrorMessage = "Room name cannot exceed 150 characters.")]
        public required string RoomName { get; set; }
        [Range(1, 9999, ErrorMessage = "Room number must be between 1 and 9999.")]
        public int RoomNumber { get; set; }
        [Required(ErrorMessage = "Availability status is required.")]
        public bool IsAvailable { get; set; }
        [Required(ErrorMessage = "RoomTypeID is required.")]
        public Guid RoomTypeID { get; set; }
        [Required(ErrorMessage = "Description is required.")]
        [MaxLength(1000, ErrorMessage = "Description cannot exceed 1000 characters.")]
        public required string Description { get; set; }
        [Required(ErrorMessage = "Image URL is required.")]
        public required string ImageUrl { get; set; }
        [Range(0, 100, ErrorMessage = "Floor number must be between 0 and 100.")]
        public int Floor { get; set; }
        [Range(0, 1, ErrorMessage = "Status must be 0 (inactive) or 1 (active).")]
        public int Status { get; set; }
        [Required]
        public DateTime CreatedDate { get; set; }
    }
}
