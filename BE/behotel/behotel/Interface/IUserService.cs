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

        Task<User?> GetUserByEmailAsync(string email);
        Task<UserDTO> GetUserDTOAsync(Guid id); 

        //Task<UserDTO> 
        //Task<UserDTO> 
        // email => tao helper gui email
        // nhap thong tin ng dung
        // khoi tao thong tin admin cho phep
        // password => 

        // 

    }
}
