using behotel.DTO;
using behotel.Helper;
namespace behotel.Interface
{
    public interface ISettingService
    {
        Task<ApiResponse<SettingDTO>> GetSettingAsync();
        Task<ApiResponse<SettingDTO>> UpdateSettingAsync(SettingDTO dto);
    }
}