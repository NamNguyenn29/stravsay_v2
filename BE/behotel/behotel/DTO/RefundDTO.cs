namespace behotel.DTO
{
    public class RefundDTO
    {
        public Guid RefundID { get; set; }
        public Guid PaymentID { get; set; }
        public string Reason { get; set; } = string.Empty;
        public DateTime RequestedAt { get; set; }
        public DateTime? ProcessedAt { get; set; }
        public int Status { get; set; }
        public DateTime CreatedDate { get; set; }

        // Optional info
        public decimal? Amount { get; set; }
    }
}
