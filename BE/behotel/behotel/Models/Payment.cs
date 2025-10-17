namespace behotel.Models
{
    public class Payment
    {
        public Guid PaymentID { get; set; }
        public Guid BookingID { get; set; }
        public Guid PaymentMethodID { get; set; }
        public decimal Amount { get; set; }
        public DateTime? PaidAt { get; set; }
        public int Status { get; set; }
        public DateTime CreatedDate { get; set; }

    }
}
