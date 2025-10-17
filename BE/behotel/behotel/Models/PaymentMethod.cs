namespace behotel.Models
{
    public class PaymentMethod
    {
        public Guid PaymentMethodID { get; set; }
        public string Name { get; set; }  
        public string? Details { get; set; }
        public int Status { get; set; }
        public DateTime CreatedDate { get; set; }


    }
}
