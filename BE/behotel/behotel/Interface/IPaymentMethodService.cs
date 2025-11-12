using behotel.DTO;

public interface IPaymentMethodService
{
    Task<IEnumerable<PaymentMethodDTO>> GetAllActiveAsync();

    Task<PaymentMethodDTO?> GetByIdAsync(Guid id);

    Task<bool> EnableAsync(Guid id);

    Task<bool> DisableAsync(Guid id);
}
