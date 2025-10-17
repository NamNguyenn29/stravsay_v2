using System.ComponentModel.DataAnnotations;

namespace behotel.Models
{
    public class ReviewPhoto
    {
        public Guid PhotoID { get; set; }

        public Guid ReviewID { get; set; }

        public string PhotoURL { get; set; }

        public int Status { get; set; } 

        public DateTime CreatedDate { get; set; }
    }
}
