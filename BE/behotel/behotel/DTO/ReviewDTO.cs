using System;
using System.ComponentModel.DataAnnotations;

namespace behotel.DTOs
{
    public class ReviewDTO
    {
        public Guid? ReviewID { get; set; }

        [Required]
        public Guid BookingID { get; set; }

        public Guid? UserID { get; set; }

        [Required]
        [Range(1, 5, ErrorMessage = "Rating phải từ 1-5")]
        public int Rating { get; set; }

        [MaxLength(200)]
        public string? Title { get; set; }

        [MaxLength(2000)]
        public string? Content { get; set; }

        public DateTime? CreatedDate { get; set; }

        // Thông tin bổ sung khi hiển thị
        public string? UserName { get; set; }
    }
}