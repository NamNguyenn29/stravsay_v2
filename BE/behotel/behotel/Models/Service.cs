namespace behotel.Models
{
    public class Service
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int Status { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
