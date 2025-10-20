using behotel.Models;
using Microsoft.EntityFrameworkCore;

namespace behotel.Interface.Implement
{
    public class UserService : IUserService
    {
        private readonly HotelManagementContext _context;

        public UserService(HotelManagementContext context)
        {
            _context = context;
        }
        public async Task<User> CreateUserAsync(User user)
        {
            // check validate 
            _context.User.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<bool> DeleteUserAsync(Guid id)
        {
            User user = await _context.User.FindAsync(id);
            if (user == null)
            {
                return false;
            }
            user.IsDeleted = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.User.ToListAsync();
        }

        public async Task<User?> GetUserByIdAsync(Guid id)
        {
            return await _context.User.FindAsync(id);
        }


    }
}
