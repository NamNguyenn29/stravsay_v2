namespace behotel.DTO
{
    public class PaymentDTO
    {
        public Guid PaymentID { get; set; }
        public Guid BookingID { get; set; }
        public Guid PaymentMethodID { get; set; }
        public decimal Amount { get; set; }
        public DateTime? PaidAt { get; set; }
        public DateTime CreatedDate { get; set; }

        public string? ProviderTransactionRef { get; set; }
        public string? MerchantReference { get; set; }
        public decimal? Fee { get; set; }
        public string? ResponsePayload { get; set; }
        public string? PayUrl { get; set; }

        // Optional display info
        public string? PaymentMethodName { get; set; }
    }
}
