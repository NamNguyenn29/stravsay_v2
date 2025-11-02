using behotel.Models;
using behotel.DTO;
using behotel.Helper;
using Microsoft.AspNetCore.Mvc;
namespace behotel.Interface
{
    public interface IUserService
    {

        //  Dang ky User
        Task<UserDTO?> ResgisterUser(UserRegister userRegister, string hahsedPassword);

        // User origin
        Task<IEnumerable<User>> GetAllUsersAsync();

        Task<ApiResponse<UserDTO>> GetUsersWithPaginationAsync(int currentPage, int pageSize);
        Task<User?> GetUserByIdAsync(Guid id);
        Task<User> CreateUserAsync(User user);
        Task<bool> DeleteUserAsync(Guid id);

        Task<User?> UpdateUserAsync( Guid id ,UpdateUser update);

        //Task UpdateRole(string roleName);

        //userDTO
        Task<UserDTO?> GetUserDTOAsync(Guid id);
        
        //User related role
        Task<UserRole?> CreateUserRoleAsync(UserRole role);
        Task<User?> GetUserByEmailAsync(string email);


        // lay role
        Task<Role?> getRoleIdByRoleName(string roleName);

        Task<ApiResponse<String>> ActiveUser(string email, string activeCode);





    }
}
