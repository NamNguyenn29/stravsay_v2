namespace behotel.Models
{
    public class Service
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Price { get; set; }
        public int Status { get; set; }
        public int CreatedDate { get; set; }
    }
}
