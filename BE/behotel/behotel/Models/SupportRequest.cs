namespace behotel.Models
{
    public class SupportRequest
    {
        public Guid Id { get; set; }
        public string UserEmail { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public  int Status { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? Response {  get; set; }
    }
}
