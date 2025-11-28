using behotel.DTO;
using behotel.Helper;
using behotel.Models;
using Microsoft.EntityFrameworkCore;

namespace behotel.Interface.Implement
{
    public class SystemLogImpl : ISystemLogService
    {
        private readonly HotelManagementContext _context;

        public SystemLogImpl(HotelManagementContext context)
        {
            _context = context;
        }

        public async Task CreateLogAsync(Guid? userId, string ipAddress, bool status, string action)
        {
            var log = new SystemLog
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                IPAddress = ipAddress,
                Status = status,
                Action = action,
                CreatedDate = DateTime.Now
            };

            _context.SystemLogs.Add(log);
            await _context.SaveChangesAsync();
        }

        public async Task<ApiResponse<SystemLogDTO>> GetAllLogsAsync(int currentPage, int pageSize)
        {
            try
            {
                var query = _context.SystemLogs
                    .Include(l => l.User)
                    .OrderByDescending(l => l.CreatedDate);

                var totalElement = await query.CountAsync();
                var totalPage = (int)Math.Ceiling((double)totalElement / pageSize);

                var logs = await query
                    .Skip((currentPage - 1) * pageSize)
                    .Take(pageSize)
                    .Select(l => new SystemLogDTO
                    {
                        Id = l.Id,
                        UserId = l.UserId,
                        UserName = l.User != null ? l.User.FullName : "Unknown",
                        IPAddress = l.IPAddress,
                        Status = l.Status,
                        Action = l.Action,
                        CreatedDate = l.CreatedDate
                    })
                    .ToListAsync();

                return new ApiResponse<SystemLogDTO>(
                    List: logs,
                    Object: null,
                    Code: "200",
                    Message: "Get all logs successfully",
                    IsSuccess: true,
                    CurrentPage: currentPage,
                    PageSize: pageSize,
                    TotalPage: totalPage,
                    TotalElement: totalElement,
                    String: null,
                    Int: null
                );
            }
            catch (Exception ex)
            {
                return new ApiResponse<SystemLogDTO>(
                    List: null,
                    Object: null,
                    Code: "500",
                    Message: ex.Message,
                    IsSuccess: false,
                    CurrentPage: 0,
                    PageSize: 0,
                    TotalPage: 0,
                    TotalElement: 0,
                    String: null,
                    Int: null
                );
            }
        }

        public async Task<ApiResponse<SystemLogDTO>> GetLogsByUserIdAsync(Guid userId, int currentPage, int pageSize)
        {
            try
            {
                var query = _context.SystemLogs
                    .Include(l => l.User)
                    .Where(l => l.UserId == userId)
                    .OrderByDescending(l => l.CreatedDate);

                var totalElement = await query.CountAsync();
                var totalPage = (int)Math.Ceiling((double)totalElement / pageSize);

                var logs = await query
                    .Skip((currentPage - 1) * pageSize)
                    .Take(pageSize)
                    .Select(l => new SystemLogDTO
                    {
                        Id = l.Id,
                        UserId = l.UserId,
                        UserName = l.User != null ? l.User.FullName : "Unknown",
                        IPAddress = l.IPAddress,
                        Status = l.Status,
                        Action = l.Action,
                        CreatedDate = l.CreatedDate
                    })
                    .ToListAsync();

                return new ApiResponse<SystemLogDTO>(
                    List: logs,
                    Object: null,
                    Code: "200",
                    Message: "Get user logs successfully",
                    IsSuccess: true,
                    CurrentPage: currentPage,
                    PageSize: pageSize,
                    TotalPage: totalPage,
                    TotalElement: totalElement,
                    String: null,
                    Int: null
                );
            }
            catch (Exception ex)
            {
                return new ApiResponse<SystemLogDTO>(
                    List: null,
                    Object: null,
                    Code: "500",
                    Message: ex.Message,
                    IsSuccess: false,
                    CurrentPage: 0,
                    PageSize: 0,
                    TotalPage: 0,
                    TotalElement: 0,
                    String: null,
                    Int: null
                );
            }
        }

        public async Task<ApiResponse<SystemLogDTO>> DeleteLogAsync(Guid logId)
        {
            try
            {
                var log = await _context.SystemLogs
                    .FirstOrDefaultAsync(l => l.Id == logId);

                if (log == null)
                {
                    return new ApiResponse<SystemLogDTO>(
                        List: null,
                        Object: null,
                        Code: "400",
                        Message: "Log not found",
                        IsSuccess: false,
                        CurrentPage: 0,
                        PageSize: 0,
                        TotalPage: 0,
                        TotalElement: 0,
                        String: null,
                        Int: null
                    );
                }

                _context.SystemLogs.Remove(log);
                await _context.SaveChangesAsync();

                return new ApiResponse<SystemLogDTO>(
                    List: null,
                    Object: null,
                    Code: "200",
                    Message: "Log deleted successfully",
                    IsSuccess: true,
                    CurrentPage: 0,
                    PageSize: 0,
                    TotalPage: 0,
                    TotalElement: 0,
                    String: null,
                    Int: null
                );
            }
            catch (Exception ex)
            {
                return new ApiResponse<SystemLogDTO>(
                    List: null,
                    Object: null,
                    Code: "500",
                    Message: ex.Message,
                    IsSuccess: false,
                    CurrentPage: 0,
                    PageSize: 0,
                    TotalPage: 0,
                    TotalElement: 0,
                    String: null,
                    Int: null
                );
            }
        }
    }
}