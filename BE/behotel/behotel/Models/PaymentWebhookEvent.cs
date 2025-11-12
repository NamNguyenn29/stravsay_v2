using System;
using System.ComponentModel.DataAnnotations;

namespace HotelBooking.Models
{


    public class PaymentWebhookEvent
    {
        [Key]
        public Guid EventID { get; set; }
        public Guid PaymentMethodID { get; set; }
        public string? Payload { get; set; }
        public string? Signature { get; set; }
        public bool Processed { get; set; }
        public string? ProcessingResult { get; set; }
        public DateTime CreatedDate { get; set; }
        public int Status { get; set; }

        // Navigation
        public PaymentMethod? PaymentMethod { get; set; }
    }

 
}
