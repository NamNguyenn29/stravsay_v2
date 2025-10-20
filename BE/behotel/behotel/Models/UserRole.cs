namespace behotel.Models
{
    public class UserRole
    {
        public Guid Id { get; set; }
        public Guid IdRole { get; set; }
        public Guid IdUser { get; set; }
        public int Status { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
