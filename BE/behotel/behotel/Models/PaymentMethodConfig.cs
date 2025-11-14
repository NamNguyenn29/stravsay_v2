using System;
using System.ComponentModel.DataAnnotations;
namespace behotel.Models
{

    public class PaymentMethodConfig
    {
        [Key]
        public Guid ConfigID { get; set; }
        public Guid PaymentMethodID { get; set; }
        public string ProviderName { get; set; } = string.Empty;
        public string? MerchantId { get; set; }
        public string? ApiKeyEncrypted { get; set; }
        public string? ApiSecretEncrypted { get; set; }
        public string? WebhookSecretEncrypted { get; set; }
        public string? CallbackUrl { get; set; }
        public string? Environment { get; set; }
        public string? AdditionalConfig { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }

        // Navigation
        public PaymentMethod? PaymentMethod { get; set; }
    }

 
}
