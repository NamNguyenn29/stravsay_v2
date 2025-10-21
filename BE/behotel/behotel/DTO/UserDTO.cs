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
        public bool IsActived { get; set; }
        public DateTime CreatedDate { get; set; }
        public List<String> RoleList { get; set; }


    }
}
