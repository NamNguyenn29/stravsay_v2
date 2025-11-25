using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace behotel.Models
{

    [Table("PaymentMethod")]
    public class PaymentMethod

    {

        [Key]
        public Guid PaymentMethodID { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public int Type { get; set; }
        public bool IsOnline { get; set; }
        public int Status { get; set; }
        public string? Details { get; set; }
        public DateTime CreatedDate { get; set; }

        // Navigation property
        public ICollection<Payment>? Payments { get; set; }
    }

   
}
