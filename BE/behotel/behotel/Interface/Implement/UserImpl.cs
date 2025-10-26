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
        // Dk user
         public async Task<User?> ResgisterUser(UserRegister userRegister ,string hashedPassword)
        {
            var activeCode = DateTimeOffset.Now.ToUnixTimeSeconds().ToString();
            User user = new User(new Guid(),null,userRegister.Email,null,null,hashedPassword,0,activeCode,false,null,DateTime.Now);
            var newUser = await CreateUserAsync(user);
            if(newUser == null)
            {
                return null;
            }
            var role = await getRoleIdByRoleName("User");
            if(role == null)
            {
                return null;
            }
            UserRole userRole = new UserRole(new Guid(),role.Id,user.Id,1, DateTime.Now);
            var newUserRole = await CreateUserRoleAsync(userRole);
            if(newUserRole == null)
            {
                return null;
            }
            return  user;

        }
        // User origin
        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.User.ToListAsync();
        }
        public async Task<User?> GetUserByIdAsync(Guid id)
        {
            return await _context.User.FindAsync(id);
        }

     
        public async Task<User> CreateUserAsync(User user)
        {
            _context.User.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }


        public async Task<bool> DeleteUserAsync(Guid id)
        {
            var user = await _context.User.FindAsync(id);
            if (user == null)
            {
                return false;
            }
            User_Deleted user_Deleted = new User_Deleted(user.Id,user.FullName,user.Email,user.DateOfBirth,user.Phone,user.Password,user.Status,user.ActiveCode,user.IsActived,user.ForgotPassCode,user.CreatedDate);
            await _context.User_Deleted.AddAsync(user_Deleted);
            _context.User.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }
        //userDTO
        public async Task<UserDTO?> GetUserDTOAsync(Guid id)
        {
            // lấy user
            var UserOrigin = await GetUserByIdAsync(id);
            if (UserOrigin == null)
            {
                return null; ;
            }
            // Replace this incorrect line:
            // UserDTO userDTO = UserDTO(){ userDTO.Email = UserOrigin.Email;userDTO.status = "Inactive"; userDTO.RoleList = new List<string>() };

            // With the following corrected code:
            UserDTO userDTO = new UserDTO
            {
                Email = UserOrigin.Email,
                status = "Inactive",
                RoleList = new List<string>()
            };
            ;
            //lấy danh sách user kèm role 
            var RoleList = await _context.UserRole.Where(ur => ur.IdUser == id).Join(_context.Role, ur => ur.IdRole, r => r.Id, (ur, r) => r.RoleName).ToListAsync();
            userDTO.Id = UserOrigin.Id;
            userDTO.FullName = UserOrigin.FullName;
            userDTO.Phone = UserOrigin.Phone;
            userDTO.Email = UserOrigin.Email;
            userDTO.DateOfBirth = UserOrigin.DateOfBirth;
            userDTO.CreatedDate = UserOrigin.CreatedDate;
            if (UserOrigin.Status == 0)
            {
                userDTO.status = "Inactive";
            }
            else
            {
                userDTO.status = "Active";

            }
            userDTO.RoleList = RoleList;
            return userDTO;

        }

        // User related Role
        public async Task<UserRole?> CreateUserRoleAsync(UserRole userRole)
        {
            _context.UserRole.Add(userRole);
            await _context.SaveChangesAsync();
            return userRole;
        }

        // get user by email
        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.User.FirstOrDefaultAsync(u => u.Email == email);
        }

        // get role
        public async Task<Role?> getRoleIdByRoleName(string roleName)
        {
            var role = await _context.Role.FirstOrDefaultAsync(r => r.RoleName == roleName);
            return role;

        }

        public async Task<bool> ActiveUser(string email, string activeCode)
        {
            var user = await GetUserByEmailAsync(email);
            if(user == null)
            {
                return false;
            }
            if (!user.ActiveCode.Equals(activeCode) )
                {
                return false;
            }
            user.IsActived = true;
            user.Status = 1;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<User?> UpdateUserAsync(Guid id,UserDTO userDTO)
        {
            var oldUser = await GetUserByIdAsync(id);
            if (oldUser == null)
            {
                return null;
            }
            var userByEmail = await GetUserByEmailAsync(userDTO.Email);
            if (userByEmail != null && userByEmail.Id != id)
            {
                return null;
            }
            oldUser.Email = userDTO.Email;
            oldUser.FullName= userDTO.FullName;
            oldUser.DateOfBirth = userDTO.DateOfBirth;
            oldUser.Phone = userDTO.Phone;
            await _context.SaveChangesAsync();
            return oldUser;
        }
    }
}
