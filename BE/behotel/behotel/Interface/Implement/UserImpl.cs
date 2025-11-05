using behotel.DTO;
using behotel.Helper;
using behotel.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using behotel.Helper.SendMail;

namespace behotel.Interface.Implement
{
    public class UserImpl : IUserService
    {
        private readonly HotelManagementContext _context;
        private readonly IMailService _mailService;


        public UserImpl(HotelManagementContext context, IMailService mailService)
        {
            _context = context;
            _mailService = mailService;
        }
        // Dk user
        public async Task<UserDTO?> ResgisterUser(UserRegister userRegister, string hashedPassword)
        {
            // Tạo mã active code
            var activeCode = DateTimeOffset.Now.ToUnixTimeSeconds().ToString();

            // Bắt đầu transaction để tránh lỗi nửa chừng
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // 1️ Tạo đối tượng User
                var user = new User(
                    Guid.NewGuid(),
                   null,
                    userRegister.Email,
                   null,
                    null,
                    hashedPassword,
                    0,
                    activeCode,
                    false,
                    null,
                    DateTime.Now
                );

                _context.User.Add(user);
                await _context.SaveChangesAsync();

                // 2️ Gán role mặc định cho user
                var role = await getRoleIdByRoleName("User");
                if (role == null)
                {
                    await transaction.RollbackAsync();
                    return null;
                }

                var userRole = new UserRole(
                    Guid.NewGuid(),
                    role.Id,
                    user.Id,
                    1,
                    DateTime.Now
                );

                _context.UserRole.Add(userRole);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                var userDTO = await GetUserDTOAsync(user.Id);
                if (userDTO == null)
                {
                    return null;
                }
                await SendActiveCode(user.Email, user.ActiveCode);
                return userDTO;
            }
            catch
            {
                await transaction.RollbackAsync();
                return null;
            }
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
        // get user co phan trag 
        public async Task<ApiResponse<UserDTO>> GetUsersWithPaginationAsync(int currentPage, int pageSize)
        {
            if (currentPage <= 0 || pageSize <= 0)
            {
                return new ApiResponse<UserDTO>(null, null, "400", "Current page and page Size is required", false, 0, 0, 0, 0, null, null);
            }
            int totalItem = await _context.User.CountAsync();
            int totalPage = (int)Math.Ceiling((double)totalItem / pageSize);
            var usersWithPagination = await _context.User
                                        .Include(u => u.UserRoles)
                                        .ThenInclude(ur => ur.Role)
                                        .OrderBy(u => u.CreatedDate)
                                        .Skip((currentPage - 1) * pageSize)
                                        .Take(pageSize)
                                        .ToListAsync();

            var userDTOsWithPagination = usersWithPagination.Select(u => new UserDTO
            {
                Id = u.Id,
                FullName = u.FullName,
                Phone = u.Phone,
                Email = u.Email,
                DateOfBirth = u.DateOfBirth,
                CreatedDate = u.CreatedDate,
                isActive = u.IsActived,
                RoleList = u.UserRoles.Select(ur => ur.Role.RoleName).ToList()
            }).ToList();

            return new ApiResponse<UserDTO>(userDTOsWithPagination, null, "200", "Get user successfully", true, currentPage, pageSize, totalPage, totalItem, null, null);

        }


        public async Task<User> CreateUserAsync(User user)
        {
            _context.User.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }


      
        //userDTO
        public async Task<UserDTO?> GetUserDTOAsync(Guid id)
        {
            // lấy user
            //var UserOrigin = await GetUserByIdAsync(id);
            //if (UserOrigin == null)
            //{
            //    return null; ;
            //}
            var UserOrigin = await _context.User.Include(u => u.UserRoles).ThenInclude(ur => ur.Role).FirstOrDefaultAsync(u => u.Id == id);
            if (UserOrigin == null)
            {
                return null;
            }
            UserDTO userDTO = new UserDTO
            {
                Email = UserOrigin.Email,
                RoleList = new List<string>()
            };
            ;
            //lấy danh sách user kèm role 
            // chuyen joi thu cong sang navigation
            //var RoleList = await _context.UserRole.Where(ur => ur.IdUser == id).Join(_context.Role, ur => ur.IdRole, r => r.Id, (ur, r) => r.RoleName).ToListAsync();
            userDTO.Id = UserOrigin.Id;
            userDTO.FullName = UserOrigin.FullName;
            userDTO.Phone = UserOrigin.Phone;
            userDTO.Email = UserOrigin.Email;
            userDTO.DateOfBirth = UserOrigin.DateOfBirth;
            userDTO.CreatedDate = UserOrigin.CreatedDate;
            userDTO.isActive = UserOrigin.IsActived;
            userDTO.RoleList = UserOrigin.UserRoles.Select(ur => ur.Role.RoleName).ToList();
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

        public async Task<ApiResponse<String>> ActiveUser(string email, string activeCode)
        {
            var user = await GetUserByEmailAsync(email);
            if (user == null)
            {
                return new ApiResponse<string>(null, null, "404", "User not found", false, 0, 0, 0, 0, "http://localhost:3000/activeSuccess", null);
            }
            if (!user.ActiveCode.Equals(activeCode))
            {
                return new ApiResponse<string>(null, null, "404", "Wrong active code", false, 0, 0, 0, 0, "http://localhost:3000/activeSuccess", null);
            }
            if (user.IsActived)
            {
                return new ApiResponse<string>(null, null, "404", "User already active", false, 0, 0, 0, 0, "http://localhost:3000/alreadyActive", null);
            }
            user.IsActived = true;
            await _context.SaveChangesAsync();
            return new ApiResponse<string>(null, null, "200", "Active user successfully", true, 0, 0, 0, 0, "http://localhost:3000/activeSuccess", null);
        }

        public async Task<User?> UpdateUserAsync(Guid id, UpdateUser updateUser)
        {
            var oldUser = await GetUserByIdAsync(id);
            if (oldUser == null)
            {
                return null;
            }
            var userByEmail = await GetUserByIdAsync(id);
            if (userByEmail != null && userByEmail.Id != id)
            {
                return null;
            }
            oldUser.Email = updateUser.Email;
            oldUser.FullName = updateUser.FullName;
            oldUser.DateOfBirth = updateUser.DateOfBirth;
            oldUser.Phone = updateUser.Phone;
            await _context.SaveChangesAsync();
            return oldUser;
        }

        private async Task<ApiResponse<UserDTO>> SendActiveCode(string to, string activationCode)
        {
            var subject = "Kích hoạt tài khoản của bạn - Stravstay";

            // Nội dung HTML email
            var body = $@"
          <div style='font-family: Arial, sans-serif; color: #333;'>
              <h2>Chào bạn 👋,</h2>
              <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>Travstay</strong>.</p>
              <p>Vui lòng bấm vào nút bên dưới để kích hoạt tài khoản của bạn:</p>
              <a href='https://localhost:7020/api/User/activeUser?email={to}&activationCode={activationCode}' 
                  style='display:inline-block; background-color:#4CAF50; color:white; padding:10px 20px;
                         text-decoration:none; border-radius:5px; font-weight:bold;'>
                  Kích hoạt tài khoản
              </a>
              <p style='margin-top:20px;'>Hoặc bạn có thể copy link sau và dán vào trình duyệt:</p>
              <p><a href='https://localhost:7020/api/User/activeUser?email={to}&activationCode={activationCode}'>Active Link</a></p>
              <hr/>
              <p style='font-size:12px; color:#777;'>Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email.</p>
          </div>
      ";
            await _mailService.SendEmailAsync(to, subject, body);
            return new ApiResponse<UserDTO>(null, null, "200", "Send mail successfully", true, 0, 0, 0, 0, null, null);
        }

    }
}
