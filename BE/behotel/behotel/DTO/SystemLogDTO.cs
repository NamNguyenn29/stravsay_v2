namespace behotel.DTO
{
    public class SystemLogDTO
    {
        public Guid Id { get; set; }
        public Guid? UserId { get; set; }
        public string? UserName { get; set; }
        public string? IPAddress { get; set; }
        public string Action { get; set; }
        public bool Status { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
