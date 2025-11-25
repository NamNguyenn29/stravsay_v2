using System;

namespace behotel.Models
{
    public class Review
    {
        public Guid ReviewID { get; set; }
        public Guid BookingID { get; set; }
        public Guid UserID { get; set; }
        public int Rating { get; set; }              // 1-5 sao
        public string? Title { get; set; }           // Tiêu đề ngắn
        public string? Content { get; set; }         // Nội dung review
        public DateTime CreatedDate { get; set; }

        public Booking Booking { get; set; }
        public User User { get; set; }
    }
}