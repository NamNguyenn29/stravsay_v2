namespace behotel.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string? FullName { get; set; }
        public string Email { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public string? Phone { get; set; }
        public string Password { get; set; }
        public int Status { get; set; }
        public string ActiveCode { get; set; }
        public bool IsActived { get; set; }
        public string ?ForgotPassCode { get; set; }
        public DateTime CreatedDate { get; set; }

        public User(Guid id, string? fullName, string email, DateOnly? dateOfBirth, string? phone, string password, int status, string activeCode, bool isActived, string? forgotPassCode, DateTime createdDate)
        {
            Id = id;
            FullName = fullName;
            Email = email;
            DateOfBirth = dateOfBirth;
            Phone = phone;
            Password = password;
            Status = status;
            ActiveCode = activeCode;
            IsActived = isActived;
            ForgotPassCode = forgotPassCode;
            CreatedDate = createdDate;
        }
    }
}
