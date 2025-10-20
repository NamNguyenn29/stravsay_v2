namespace behotel.DTO
{
    using behotel.Models;
    public class UserDTO
    {
        public Guid Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Phone { get; set; }
        public int Status { get; set; }
        public string ActiveCode { get; set; }
        public bool IsActived { get; set; }
        public string? ForgotPassCode { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedDate { get; set; }

        public List<Role> RoleList { get; set; }


    }
}
