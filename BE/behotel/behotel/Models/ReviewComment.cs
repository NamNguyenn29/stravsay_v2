using System.ComponentModel.DataAnnotations;

namespace behotel.Models
{
    public class ReviewComment
    {
        public Guid CommentID { get; set; }

        public Guid ReviewID { get; set; }

        public Guid UserID { get; set; }

        public string Content { get; set; }

        public int Status { get; set; } 

        public DateTime CreatedDate { get; set; }
    }
}
