namespace behotel.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Password { get; set; }
        public int Status { get; set; }
        public string ActiveCode { get; set; }
        public bool IsActive { get; set; }
        public string ForgotPasswordCode { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedDate { get; set; }


    }
}
