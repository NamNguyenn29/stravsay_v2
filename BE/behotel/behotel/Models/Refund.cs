
using System.ComponentModel.DataAnnotations;

namespace behotel.Models
{
    public class Refund
    {
        [Key]
        public Guid RefundID { get; set; }
        public Guid PaymentID { get; set; }
        public string Reason { get; set; } = string.Empty;
        public DateTime RequestedAt { get; set; }
        public DateTime? ProcessedAt { get; set; }
        public int Status { get; set; }
        public DateTime CreatedDate { get; set; }

        // Navigation
        public Payment? Payment { get; set; }

    }
}
