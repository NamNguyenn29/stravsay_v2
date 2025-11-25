//using System.ComponentModel.DataAnnotations;
//using System.ComponentModel.DataAnnotations.Schema;
//namespace behotel.Models
//{
//    public class Discount
//    {
//        [Key]
//        public Guid Id { get; set; }
//        [Required]
//        [MaxLength(50)]
//        public string DiscountCode { get; set; }
//        [Required]
//        public decimal DiscountValue { get; set; }
//        public decimal? MaxDiscountAmount { get; set; }
//        [Required]
//        public DateTime StartDate { get; set; }
//        [Required]
//        public DateTime ExpiredDate { get; set; }
//        [Required]
//        public decimal MinOrderAmount { get; set; }
//        [Required]
//        public int Status { get; set; }   // 1 = Active, 0 = Inactive
//        public DateTime CreatedDate { get; set; }
//    }
//}