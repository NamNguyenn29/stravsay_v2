using System.ComponentModel.DataAnnotations;

namespace behotel.Models
{
    public class SystemLog
    {
        public Guid LogID { get; set; }

        public Guid? UserID { get; set; }

        public string? Action { get; set; }    

        public int LogType { get; set; }       

        public int Status { get; set; }  

        public DateTime CreatedDate { get; set; }
    }
}
