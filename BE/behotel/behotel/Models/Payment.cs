using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace behotel.Models


{

    public class Payment
    {
        [Key]
        public Guid PaymentID { get; set; }
        public Guid BookingID { get; set; }
        public Guid PaymentMethodID { get; set; }
        public decimal Amount { get; set; }
        public DateTime? PaidAt { get; set; }
        public int Status { get; set; }
        public DateTime CreatedDate { get; set; }

        // Optional / new fields from previous discussions
        public string? ProviderTransactionRef { get; set; }
        public string? MerchantReference { get; set; }
        public decimal? Fee { get; set; }
        public string? ResponsePayload { get; set; }
        public string? PayUrl { get; set; }

        // Navigation properties (optional if using EF Core)
        public PaymentMethod? PaymentMethod { get; set; }
    }

}