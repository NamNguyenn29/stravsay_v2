namespace behotel.Models
{
    public class Refund
    {
        public Guid RefundID { get; set; }
        public Guid PaymentID { get; set; }
        public string Reason { get; set; }
        public DateTime RequestedAt { get; set; }
        public DateTime? ProcessedAt { get; set; }
        public int Status { get; set; }
        public DateTime CreatedDate { get; set; }

    }
}
