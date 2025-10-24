using behotel.DTO;
using behotel.Models;
using Microsoft.EntityFrameworkCore;

namespace behotel.Interface.Implement
{
    public class UserImpl : IUserService
    {
        private readonly HotelManagementContext _context;

        public UserImpl(HotelManagementContext context)
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
            //User user = await _context.User.FindAsync(id);
            //if (user == null)
            //{
            //    return false;
            //}
            //await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.User.ToListAsync();
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.User.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetUserByIdAsync(Guid id)
        {
            return await _context.User.FindAsync(id);
        }

        public async Task<UserDTO> GetUserDTOAsync(Guid id)
        {
            // lấy user
            var UserOrigin = await GetUserByIdAsync(id);
            if (UserOrigin == null)
            {
                return null; ;
            }
            UserDTO userDTO = new UserDTO() ;
            //lấy danh sách user kèm role 
            var RoleList =  await _context.UserRole.Where(ur => ur.IdUser == id).Join(_context.Role, ur => ur.IdRole, r=> r.Id, (ur,r) => r.RoleName ).ToListAsync();
            userDTO.Id = UserOrigin.Id;
            userDTO.FullName = UserOrigin.FullName;
            userDTO.Phone = UserOrigin.Phone;
            userDTO.Email = UserOrigin.Email;
            userDTO.DateOfBirth = UserOrigin.DateOfBirth;
            userDTO.CreatedDate = UserOrigin.CreatedDate;
            if(UserOrigin.Status == 0)
            {
                userDTO.status = "Inactive";
            } else { 
                userDTO.status = "Active";

            }
            userDTO.RoleList = RoleList;
            return userDTO;

            



        }
    }
}
