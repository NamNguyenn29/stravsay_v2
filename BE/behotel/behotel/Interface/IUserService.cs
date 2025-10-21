using behotel.Models;
using behotel.DTO;
namespace behotel.Interface
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User?> GetUserByIdAsync(Guid id);
        Task<User> CreateUserAsync(User user);
        Task<bool> DeleteUserAsync(Guid id);

        Task<UserDTO> GetUserDTOAsync(Guid id); 

    }
}
