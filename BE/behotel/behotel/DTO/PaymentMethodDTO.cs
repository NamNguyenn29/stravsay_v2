namespace behotel.DTO
{
    public class PaymentMethodDTO
    {
        public Guid PaymentMethodID { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public int Type { get; set; }
        public bool IsOnline { get; set; }
        public int Status { get; set; }
        public string? Details { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
