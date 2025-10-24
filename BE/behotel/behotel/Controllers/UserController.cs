using behotel.DTO;
using behotel.Helper;
using behotel.Interface;
using behotel.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace behotel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userImpl )
        {
            _userService = userImpl;
        }

        [HttpGet]
        public async Task<ApiResponse<UserDTO> >GetAll()
        {
            
            var users = await _userService.GetAllUsersAsync();
            var userDTOs = new List<UserDTO>();
            foreach (var user in users)
            {
                userDTOs.Add(await _userService.GetUserDTOAsync(user.Id));
            }
            ApiResponse<UserDTO> _apiResponse = new ApiResponse<UserDTO>(0, 0, userDTOs, null, "200", "Get all users successfully", true, null, 0);
            return _apiResponse;
        }

        [HttpGet("id")]
        public async Task<ApiResponse<UserDTO>> GetUserById(string idString)
        {
            ApiResponse<UserDTO> _apiResponse;
            if (String.IsNullOrWhiteSpace(idString))
            {
                _apiResponse = new ApiResponse<UserDTO>(0, 0, null, null, "404", "Bad request", false, null, 0);
            }
            Guid id = Guid.Parse(idString);
            var user = await _userService.GetUserDTOAsync(id);
            if (user == null)
            {
                _apiResponse = new ApiResponse<UserDTO>(0, 0, null, null, "404", "User not found", false, null, 0);
            }
         
            _apiResponse = new ApiResponse<UserDTO>(0, 0, null, user, "200", "Get user successfully", true, null, 0);
            return _apiResponse;

        }

        [HttpPost("register")]
        public async Task<ApiResponse<UserDTO>> Register(UserRegister userRegister)
        {
            ApiResponse<UserDTO> _apiResponse;
            if (!ModelState.IsValid)
                {
                    _apiResponse = new ApiResponse<UserDTO>(0, 0, null, null, "404", "Invalid Infor", false, null, 0);
                }
            var existingUser = await _userService.GetUserByEmailAsync(userRegister.Email);
            if(existingUser != null)
            {
                _apiResponse = new ApiResponse<UserDTO>(0, 0, null, null, "404", "Email Exists", false, null, 0);
            }
            int workFactor = 12;
            string hashed = BCrypt.Net.BCrypt.HashPassword(userRegister.Password, workFactor);
            //bool isValid = BCrypt.Net.BCrypt.Verify(candidate, storedHash);

        }
    

      

       

    }
}
