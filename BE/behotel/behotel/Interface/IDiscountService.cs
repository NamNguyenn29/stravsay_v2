using behotel.Models;

namespace behotel.Interface
{
    public interface IDiscountService
    {
        Task<IEnumerable<Discount>> GetAllDiscountAsync();
        Task<Discount?> GetDiscountByIdAsync(Guid id);
        Task<Discount> CreateDiscountAsync(Discount discount);
        Task <bool> DeleteDiscountAsync(Guid id);


    }
}
