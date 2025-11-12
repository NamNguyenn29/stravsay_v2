using System;
using System.ComponentModel.DataAnnotations;

namespace behotel.Models
{
    public class ReviewAttachment
    {
        [Key]
        public Guid AttachmentID { get; set; }

        public Guid ReviewID { get; set; }

        public string Url { get; set; }
        public string? ContentType { get; set; }
        public long? Size { get; set; }
        public int Status { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
