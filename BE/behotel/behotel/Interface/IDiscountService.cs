using behotel.DTO;
using behotel.Helper;

namespace behotel.Interface
{
    public interface IDiscountService
    {
        Task<ApiResponse<DiscountDTO>> GetAllAsync(int currentPage, int pageSize);

        Task<ApiResponse<DiscountDTO>> GetByIdAsync(Guid id);

        Task<ApiResponse<DiscountDTO>> GetByCodeAsync(string code);

        Task<ApiResponse<DiscountDTO>> CreateAsync(DiscountDTO dto);

        Task<ApiResponse<DiscountDTO>> UpdateAsync(Guid id, DiscountDTO dto);

      
        Task<ApiResponse<string>> DeleteAsync(Guid id);

        Task<ApiResponse<DiscountDTO>> ValidateAndCalculateAsync(string code, decimal orderAmount);
    }
}