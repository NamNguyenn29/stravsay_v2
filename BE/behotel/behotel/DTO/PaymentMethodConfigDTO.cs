namespace behotel.DTO
{
    public class PaymentMethodConfigDTO
    {
        public Guid ConfigID { get; set; }
        public Guid PaymentMethodID { get; set; }
        public string ProviderName { get; set; } = string.Empty;
        public string? MerchantId { get; set; }
        public string? CallbackUrl { get; set; }
        public string? Environment { get; set; }
        public string? AdditionalConfig { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
