using behotel.DTO;
using behotel.Helper;

namespace behotel.Interface
{
    public interface ISystemLogService
    {
        Task CreateLogAsync(Guid? userId, string ipAddress, bool status, string action);
        Task<ApiResponse<SystemLogDTO>> GetAllLogsAsync(int currentPage, int pageSize);
        Task<ApiResponse<SystemLogDTO>> GetLogsByUserIdAsync(Guid userId, int currentPage, int pageSize);
        Task<ApiResponse<SystemLogDTO>> DeleteLogAsync(Guid logId); 
    }
}