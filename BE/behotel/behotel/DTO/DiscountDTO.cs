using System.ComponentModel.DataAnnotations;

namespace behotel.DTO
{
    public class DiscountDTO
    {
        public Guid Id { get; set; }
        public string DiscountCode { get; set; }
        [Range(0, 100)]
        public decimal DiscountValue { get; set; }
        public decimal? MaxDiscountAmount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime ExpiredDate { get; set; }
        public decimal MinOrderAmount { get; set; }
        public int DiscountUsage { get; set; }
        public int MaxUsageLimit { get; set; }
        public int Status { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}