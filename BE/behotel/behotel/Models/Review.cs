using System.ComponentModel.DataAnnotations;

namespace behotel.Models
{
    public class Review
    {
        public Guid ReviewID { get; set; }

        public Guid BookingID { get; set; }

        public Guid UserID { get; set; }

        public int Rating { get; set; }
        public string? Title { get; set; }

        public string? Content { get; set; }

        public int Status { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}
