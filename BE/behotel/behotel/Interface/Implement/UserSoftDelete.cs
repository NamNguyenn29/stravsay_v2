using behotel.Helper;
using behotel.Models;
using Microsoft.EntityFrameworkCore;

namespace behotel.Interface.Implement
{
    public class UserSoftDelete : IUserSoftDeleteService
    {
        private readonly IBookingService _bookingService;
        private readonly HotelManagementContext _context;

        public UserSoftDelete(IBookingService bookingService, HotelManagementContext context)
        {
            _context = context;
            _bookingService = bookingService;
        }

        public async Task<ApiResponse<string>> SoftDeleteUser(Guid userId)
        {
            // Xóa tất cả bookings của user
            var userBookings = await _context.Booking.Where(b => b.UserId == userId).ToListAsync();
            foreach (var booking in userBookings)
            {
                await _bookingService.SoftDeleteBookingAsync(booking.Id);
            }

            // Xóa user
            return await DeleteUserAsync(userId);
        }

        public async Task<ApiResponse<string>> DeleteUserAsync(Guid id)
        {
            var user = await _context.User.FindAsync(id);
            if (user == null)
            {
                return new ApiResponse<string>(null, null, "404", "User not found", false, 0, 0, 0, 0, null, 0);
            }

            var userRoles = await _context.UserRole.Where(ur => ur.IdUser == id).ToListAsync();
            var logs = await _context.SystemLogs.Where(l => l.UserId == user.Id).ToListAsync();

            // Tạo User_Deleted
            User_Deleted user_Deleted = new User_Deleted(
                user.Id,
                user.FullName,
                user.Email,
                user.DateOfBirth,
                user.Phone,
                user.Password,
                user.Status,
                user.ActiveCode,
                user.IsActived,
                user.ForgotPassCode,
                user.CreatedDate
            );

            // Tạo UserRole_Deleted
            List<UserRole_Deleted> userRoles_Deleted = new List<UserRole_Deleted>();
            foreach (UserRole userRole in userRoles)
            {
                userRoles_Deleted.Add(new UserRole_Deleted()
                {
                    Id = userRole.Id,
                    IdRole = userRole.IdRole,
                    IdUser = userRole.IdUser,
                    Status = userRole.Status,
                    CreatedDate = userRole.CreatedDate
                });
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Xóa SystemLogs và UserRoles trước
                if (logs.Count > 0)
                {
                    _context.SystemLogs.RemoveRange(logs);
                }
                if (userRoles.Count > 0)
                {
                    _context.UserRole.RemoveRange(userRoles);
                }

                // Lưu vào bảng deleted
                await _context.User_Deleted.AddAsync(user_Deleted);
                if (userRoles_Deleted.Count > 0)
                {
                    await _context.UserRole_Deleted.AddRangeAsync(userRoles_Deleted);
                }

                // Xóa User
                _context.User.Remove(user);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return new ApiResponse<string>(null, null, "200", "Delete user successfully", true, 0, 0, 0, 0, null, 0);
            }
            catch (Exception ex)
            {
                var errorMessage = ex.InnerException?.Message ?? ex.Message;
                Console.WriteLine($"Error: {errorMessage}");
                Console.WriteLine($"Stack: {ex.StackTrace}");
                await transaction.RollbackAsync();

                return new ApiResponse<string>(null, errorMessage, "500", "Failed to delete user", false, 0, 0, 0, 0, null, 0);
            }
        }
    }
}