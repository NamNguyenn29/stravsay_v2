using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace behotel.Models
{
    [Table("SystemLog")]
    public class SystemLog
    {
        [Key]
        public Guid Id { get; set; }

        public Guid? UserId { get; set; }

        [MaxLength(45)]
        public string? IPAddress { get; set; }

        [MaxLength(50)]
        public string Action { get; set; } 

        [Required]
        public bool Status { get; set; }

        [Required]
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public User? User { get; set; }
    }


    public static class LogAction
    {
        public const string Login = "Login";
        public const string LoginFailed = "LoginFailed";
        public const string Logout = "Logout";
    }
}