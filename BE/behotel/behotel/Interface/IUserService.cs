using behotel.Models;
using behotel.DTO;
using behotel.Helper;
namespace behotel.Interface
{
    public interface IUserService
    {

        //  Dang ky User
        Task<User?> ResgisterUser(UserRegister userRegister, string hahsedPassword);

        // User origin
        Task<IEnumerable<User>> GetAllUsersAsync();

        Task<ApiResponse<UserDTO>> GetUsersWithPaginationAsync(int currentPage, int pageSize);
        Task<User?> GetUserByIdAsync(Guid id);
        Task<User> CreateUserAsync(User user);
        Task<bool> DeleteUserAsync(Guid id);

        Task<User?> UpdateUserAsync( Guid id ,UserDTO userDTO);

        //Task UpdateRole(string roleName);

        //userDTO
        Task<UserDTO?> GetUserDTOAsync(Guid id);
        
        //User related role
        Task<UserRole?> CreateUserRoleAsync(UserRole role);
        Task<User?> GetUserByEmailAsync(string email);


        // lay role
        Task<Role?> getRoleIdByRoleName(string roleName);

        Task<bool> ActiveUser(string email, string activeCode);





    }
}
