using behotel.DTO;

namespace behotel.Interfaces
{

    public interface IPaymentMethodConfigService
    {

        Task<PaymentMethodConfigDTO?> GetByMethodCodeAsync(string methodCode);


        Task<PaymentMethodConfigDTO?> GetByIdAsync(Guid configId);

        Task<bool> CreateOrUpdateAsync(PaymentMethodConfigDTO config);

        Task<bool> DeleteAsync(Guid configId);


        Task<IEnumerable<PaymentMethodConfigDTO>> GetAllAsync();

        Task<PaymentMethodConfigDTO?> GetDecryptedConfigAsync(Guid paymentMethodId);
    }
}
