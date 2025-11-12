using behotel.DTO;

public interface IPaymentService
{
    Task<PaymentDTO> CreateAsync(PaymentDTO payment);

    Task<PaymentDTO?> GetByIdAsync(Guid paymentId);

    Task<IEnumerable<PaymentDTO>> GetByBookingIdAsync(Guid bookingId);
    Task<object> ProcessVnPayReturnAsync(IQueryCollection collections);

    Task<bool> UpdateStatusAsync(Guid paymentId, int status);


    Task<bool> MarkAsPaidAsync(Guid paymentId, string? providerRef, string? responsePayload);


    Task<bool> CancelAsync(Guid paymentId);

}
