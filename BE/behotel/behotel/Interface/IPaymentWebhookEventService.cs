using behotel.DTO;

namespace behotel.Interfaces
{

    public interface IPaymentWebhookEventService
    {

        Task<PaymentWebhookEventDTO> LogEventAsync(string provider, string payload, string? signature);


        Task<bool> ValidateSignatureAsync(string provider, string payload, string signature);

        Task<bool> ProcessEventAsync(Guid eventId);

        Task<IEnumerable<PaymentWebhookEventDTO>> GetUnprocessedEventsAsync();

        Task<PaymentWebhookEventDTO?> GetByIdAsync(Guid eventId);
    }
}
