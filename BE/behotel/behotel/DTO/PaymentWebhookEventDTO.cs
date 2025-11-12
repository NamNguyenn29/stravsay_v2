namespace behotel.DTO
{
    public class PaymentWebhookEventDTO
    {
        public Guid EventID { get; set; }
        public Guid PaymentMethodID { get; set; }
        public string? Payload { get; set; }
        public string? Signature { get; set; }
        public bool Processed { get; set; }
        public string? ProcessingResult { get; set; }
        public DateTime CreatedDate { get; set; }
        public int Status { get; set; }
    }
}
