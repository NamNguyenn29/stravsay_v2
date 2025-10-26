namespace behotel.Models
{
    public class UserRole
    {
        public Guid Id { get; set; }
        public Guid IdRole { get; set; }
        public Guid IdUser { get; set; }
        public int Status { get; set; }
        public DateTime CreatedDate { get; set; }

        public UserRole (Guid Id, Guid IdRole, Guid IdUser, int Status, DateTime CreatedDate)
        {
            this.Id = Id;
            this.IdRole = IdRole;
            this.IdUser = IdUser;
            this.Status = Status;
            this.CreatedDate = CreatedDate;
        }
       
    }
}
