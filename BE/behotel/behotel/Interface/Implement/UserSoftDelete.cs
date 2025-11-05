using behotel.Helper;
using behotel.Models;
using Microsoft.EntityFrameworkCore;

namespace behotel.Interface.Implement
{
    public class UserSoftDelete : IUserSoftDeleteService
    {
        private readonly IBookingService _bookingService;
        private readonly HotelManagementContext _context;
        public UserSoftDelete ( IBookingService bookingService,HotelManagementContext context)
        {
            _context = context;
            _bookingService = bookingService;
        }
        public async Task<ApiResponse<string>> SoftDeleteUser(Guid userId)
        {
            var userBookings = await _context.Booking.Where(b => b.UserId == userId).ToListAsync();
            foreach (var booking in userBookings)
            {
                await _bookingService.SoftDeleteBookingAsync(booking.Id);
            }
            await DeleteUserAsync(userId);
            return new ApiResponse<string>(null, null, "200", "Delete user successfully", true, 0, 0, 0, 0, null, 0);
        }

        public async Task<ApiResponse<string>> DeleteUserAsync(Guid id)
        {
            var user = await _context.User.FindAsync(id);
            if (user == null)
            {
                return new ApiResponse<string>(null, null, "404", "User not found", false, 0, 0, 0, 0, null, 0);
            }
            var userRoles = await _context.UserRole.Where(ur => ur.IdUser == id).ToListAsync();
            User_Deleted user_Deleted = new User_Deleted(user.Id, user.FullName, user.Email, user.DateOfBirth, user.Phone, user.Password, user.Status, user.ActiveCode, user.IsActived, user.ForgotPassCode, user.CreatedDate);
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
                await _context.User_Deleted.AddAsync(user_Deleted);
                await _context.UserRole_Deleted.AddRangeAsync(userRoles_Deleted);
                _context.UserRole.RemoveRange(userRoles);
                _context.User.Remove(user);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return new ApiResponse<string>(null, null, "200", "Delete user successfully", true, 0, 0, 0, 0, null, 0); ;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return new ApiResponse<string>(null, ex.Message, "400", "Failed to delete user", false, 0, 0, 0, 0, null, 0);
            }

        }
    }
}
