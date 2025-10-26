using behotel.DTO;
using behotel.Helper;
using behotel.Helper.SendMail;
using behotel.Interface;
using behotel.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static System.Net.WebRequestMethods;

namespace behotel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMailService _mailService;

        public UserController(IUserService userService, IMailService mailIService)
        {
            _userService = userService;
            _mailService = mailIService;
        }

        [HttpGet]
        public async Task<ApiResponse<UserDTO>> GetAll()
        {

            var users = await _userService.GetAllUsersAsync();
            var userDTOs = new List<UserDTO>();
            foreach (var user in users)
            {
                var userDTO = await _userService.GetUserDTOAsync(user.Id);
                if (userDTO != null)
                {
                    userDTOs.Add(userDTO);

                }
            }
            ApiResponse<UserDTO> _apiResponse = new ApiResponse<UserDTO>(0, 0, userDTOs, null, "200", "Get all users successfully", true, null, 0);
            return _apiResponse;
        }

        [HttpGet("{id}")]
        public async Task<ApiResponse<UserDTO>> GetUserById(string id)
        {
            ApiResponse<UserDTO> _apiResponse;
            if (String.IsNullOrWhiteSpace(id))
            {
                return _apiResponse = new ApiResponse<UserDTO>(0, 0, null, null, "404", "Bad request", false, null, 0);
            }
            Guid idGuid = Guid.Parse(id);
            var user = await _userService.GetUserDTOAsync(idGuid);
            if (user == null)
            {
                return _apiResponse = new ApiResponse<UserDTO>(0, 0, null, null, "404", "User not found", false, null, 0);
            }

            _apiResponse = new ApiResponse<UserDTO>(0, 0, null, user, "200", "Get user successfully", true, null, 0);
            return _apiResponse;

        }

        [HttpPost("register")]
        public async Task<ApiResponse<User>> Register(UserRegister userRegister)
        {
            ApiResponse<User> _apiResponse;
            if (!ModelState.IsValid)
            {
                var errorMessages = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                var combinedErrors = string.Join("; ", errorMessages);
                return _apiResponse = new ApiResponse<User>(0, 0, null, null, "404", combinedErrors, false, null, 0);
            }
            var existingUser = await _userService.GetUserByEmailAsync(userRegister.Email);
            if (existingUser != null)
            {
                return _apiResponse = new ApiResponse<User>(0, 0, null, null, "404", "Email Exists", false, null, 0);
            }
            int workFactor = 12;
            string hashed = BCrypt.Net.BCrypt.HashPassword(userRegister.Password, workFactor);

            var registedusr = await _userService.ResgisterUser(userRegister, hashed);
            if (registedusr == null)
            {
                return _apiResponse = new ApiResponse<User>(0, 0, null, null, "404", "Register Failed", false, null, 0);
            }
            await SendActiveCode(userRegister.Email, registedusr.ActiveCode);
            return _apiResponse = new ApiResponse<User>(0, 0, null, registedusr, "200", "Register successfully", true, null, 0);
        }

        [HttpPost("sendActiveCode")]
        public async Task<ApiResponse<UserDTO>> SendActiveCode(string to, string activationCode)
        {
            var subject = "Kích hoạt tài khoản của bạn - My App";

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
                    <p><a href='http://https://localhost:7020/api/User/activeUser?email={to}&activationCode={activationCode}'>Active Link</a></p>
                    <hr/>
                    <p style='font-size:12px; color:#777;'>Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email.</p>
                </div>
            ";
            await _mailService.SendEmailAsync(to, subject, body);
            ApiResponse<UserDTO> _apiResponse = new ApiResponse<UserDTO>(0, 0, null, null, "200", "Send mail successfully", true, null, 0);
            return _apiResponse;
        }

        [HttpGet("activeUser")]
        public async Task<IActionResult> ActiveUser(String email, String activationCode)
        {
            var isSuccess = await _userService.ActiveUser(email, activationCode);
            if (!isSuccess)
            {
                return Redirect("http://localhost:3000/activeFailed");
            }
            return Redirect("http://localhost:3000/activeSuccess");

        }
        [HttpPost("login")]
        public async Task<ApiResponse<User>> Login(UserRegister userRegistered)
        {
            ApiResponse<User> _apiResponse;
            if (!ModelState.IsValid)
            {
                var errorMessages = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                var combinedErrors = string.Join("; ", errorMessages);
                return _apiResponse = new ApiResponse<User>(0, 0, null, null, "404", combinedErrors, false, null, 0);
            }

            var userByEmail = await _userService.GetUserByEmailAsync(userRegistered.Email);
            if (userByEmail == null)
            {
                return _apiResponse = new ApiResponse<User>(0, 0, null, null, "404", "Accoutn is not exists", false, null, 0);
            }
            if (userByEmail.IsActived == false)
            {
                return _apiResponse = new ApiResponse<User>(0, 0, null, null, "404", "Inactive Account", false, null, 0);
            }
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(userRegistered.Password, userByEmail.Password);
            if (!isPasswordValid)
            {
                return _apiResponse = new ApiResponse<User>(0, 0, null, null, "404", "InCorrect Information", false, null, 0);
            }
            return _apiResponse = new ApiResponse<User>(0, 0, null, null, "404", "Login successfully", true, null, 0);

        }

        [HttpPut("{id}")]
        public async Task<ApiResponse<UserDTO>> UpdateUser(string id, [FromBody] UserDTO userDTO)
        {
            if (string.IsNullOrEmpty(id))
            {
                return new ApiResponse<UserDTO>(0, 0, null, null, "400", "User Id can not be null", false, null, 0);
            }
            Guid guidId = Guid.Parse(id);
            if (!ModelState.IsValid)
            {
                var errorMessages = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                var combinedErrors = string.Join("; ", errorMessages);
                return new ApiResponse<UserDTO>(0, 0, null, null, "400", combinedErrors, false, null, 0);
            }
            if (userDTO.Id != guidId)
                return new ApiResponse<UserDTO>(0, 0, null, null, "400", "ID mismatch between URL and body", false, null, 0);

            var updatedUser = await _userService.UpdateUserAsync(guidId, userDTO);
            if (updatedUser == null)
            {
                return new ApiResponse<UserDTO>(0, 0, null, null, "404", "Update user failed", false, null, 0);
            }
            var updatedUserDTO = await _userService.GetUserDTOAsync(updatedUser.Id);
            if (updatedUserDTO == null)
            {
                return new ApiResponse<UserDTO>(0, 0, null, null, "404", "Failed to get user information", false, null, 0);
            }
            return new ApiResponse<UserDTO>(0, 0, null, updatedUserDTO, "200", "Update User successfully", true, null, 0);

        }

        [HttpDelete("{id}")]
        public async Task<ApiResponse<User>> DeleteUser(string Id)
        {
            if (string.IsNullOrEmpty(Id))
            {
                return new ApiResponse<User>(0, 0, null, null, "404", "Failed to delete user", false, null, 0);
            }
            Guid guidId = Guid.Parse(Id);
            bool isDeleteSuccess = await _userService.DeleteUserAsync(guidId);
            if (!isDeleteSuccess)
            {
                return new ApiResponse<User>(0, 0, null, null, "404", "Failed to delete user", false, null, 0);

            }
            return new ApiResponse<User>(0, 0, null, null, "200", "Delete User successfully", true, null, 0);
        }









    }
}
