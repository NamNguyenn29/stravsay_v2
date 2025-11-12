using System;
using System.ComponentModel.DataAnnotations;

namespace behotel.Models
{
    public class Review_Deleted
    {
        [Key]
        public Guid ReviewID { get; set; }
        public Guid BookingID { get; set; }
        public Guid UserID { get; set; }

        public string? Title { get; set; }
        public string? Content { get; set; }
        public int Rating { get; set; }

        public string? ModerationReason { get; set; }
        public string? ModerationNote { get; set; }

        public int Status { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public Guid? UpdatedBy { get; set; }

        public DateTime DeletedDate { get; set; }
        public Guid? DeletedBy { get; set; }
    }
}
