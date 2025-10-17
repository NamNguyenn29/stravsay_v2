using System.ComponentModel.DataAnnotations;

namespace behotel.Models
{
    public class SystemSetting
    {
        public Guid SettingID { get; set; }

        public string Key { get; set; } 

        public string? Value { get; set; }             

        public int Status { get; set; }          

        public DateTime CreatedDate { get; set; }
    }
}
