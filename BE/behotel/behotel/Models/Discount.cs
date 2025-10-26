namespace behotel.Models
{
    public class Discount
    {
        public Guid Id { get; set; }
        public required string DiscountCode { get; set; }
        public decimal DiscountValue { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime ExpiredDate { get; set; }
        public Decimal MinOrderAmount { get; set; }
        public int MaxUsage { get; set; }
        public int Status { get; set; }
        public DateTime CreatedDate { get; set; }

    }
}
