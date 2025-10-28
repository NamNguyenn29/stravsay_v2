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
        public async Task<ApiResponse<UserDTO>> GetAll(int currentPage, int pageSize)
        {

            return (_userService.GetUsersWithPaginationAsync(currentPage, pageSize)).Result;
        }

        [HttpGet("{id}")]
        public async Task<ApiResponse<UserDTO>> GetUserById(string id)
        {
            if (String.IsNullOrWhiteSpace(id))
            {
                return new ApiResponse<UserDTO>(null, null, "400", "Id is required", false, 0, 0, 0, 0, null, null);
            }
            Guid idGuid = Guid.Parse(id);
            var user = await _userService.GetUserDTOAsync(idGuid);
            if (user == null)
            {
                return new ApiResponse<UserDTO>(null, null, "404", "User not found", false, 0, 0, 0, 0, null, null);
            }

            return new ApiResponse<UserDTO>(null, user, "200", "Get user successfully", true, 0, 0, 0, 1, null, null);

        }

        [HttpPost("register")]
        public async Task<ApiResponse<User>> Register(UserRegister userRegister)
        {
            if (!ModelState.IsValid)
            {
                var errorMessages = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                var combinedErrors = string.Join("; ", errorMessages);
                return new ApiResponse<User>(null, null, "400", combinedErrors, false, 0, 0, 0, 0, null, null);
            }
            var existingUser = await _userService.GetUserByEmailAsync(userRegister.Email);
            if (existingUser != null)
            {
                return new ApiResponse<User>(null, null, "400", "Email already exists", false, 0, 0, 0, 0, null, null);
            }
            int workFactor = 12;
            string hashed = BCrypt.Net.BCrypt.HashPassword(userRegister.Password, workFactor);

            var registedusr = await _userService.ResgisterUser(userRegister, hashed);
            if (registedusr == null)
            {
                return new ApiResponse<User>(null, null, "400", "Failed to register account", false, 0, 0, 0, 0, null, null);
            }
            await SendActiveCode(userRegister.Email, registedusr.ActiveCode);
            return new ApiResponse<User>(null, registedusr, "200", "Account registered successfully", true, 0, 0, 0, 1, null, null);
        }

        [HttpPost("sendActiveCode")]
        public async Task<ApiResponse<UserDTO>> SendActiveCode(string to, string activationCode)
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
                    <p><a href='http://https://localhost:7020/api/User/activeUser?email={to}&activationCode={activationCode}'>Active Link</a></p>
                    <hr/>
                    <p style='font-size:12px; color:#777;'>Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email.</p>
                </div>
            ";
            await _mailService.SendEmailAsync(to, subject, body);
            return new ApiResponse<UserDTO>(null, null, "200", "Send mail successfully", true, 0, 0, 0, 0, null, null);
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
                return _apiResponse = new ApiResponse<User>(null, null, "400", combinedErrors, false, 0, 0, 0, 0, null, null);
            }

            var userByEmail = await _userService.GetUserByEmailAsync(userRegistered.Email);
            if (userByEmail == null)
            {
                return _apiResponse = new ApiResponse<User>(null, null, "400", "Account is not exists", false, 0, 0, 0, 0, null, null);
            }
            if (userByEmail.IsActived == false)
            {
                return _apiResponse = new ApiResponse<User>(null, null, "400", "Inactive Account", false, 0, 0, 0, 0, null, null);
            }
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(userRegistered.Password, userByEmail.Password);
            if (!isPasswordValid)
            {
                return _apiResponse = new ApiResponse<User>(null, null, "400", "InCorrect Information", false, 0, 0, 0, 0, null, null);
            }
            return _apiResponse = new ApiResponse<User>(null, null, "200", "Login successfully", true, 0, 0, 0, 0, null, null);

        }

        [HttpPut("{id}")]
        public async Task<ApiResponse<UserDTO>> UpdateUser(string id, [FromBody] UserDTO userDTO)
        {
            if (string.IsNullOrEmpty(id))
            {
                return new ApiResponse<UserDTO>(null, null, "400", "User Id can not be null", false, 0, 0, 0, 0, null, null);
            }
            Guid guidId = Guid.Parse(id);
            if (!ModelState.IsValid)
            {
                var errorMessages = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                var combinedErrors = string.Join("; ", errorMessages);
                return new ApiResponse<UserDTO>(null, null, "400", combinedErrors, false, 0, 0, 0, 0, null, null);
            }
            if (userDTO.Id != guidId)
                return new ApiResponse<UserDTO>(null, null, "400", "ID mismatch between URL and body", false, 0, 0, 0, 0, null, null);

            var updatedUser = await _userService.UpdateUserAsync(guidId, userDTO);
            if (updatedUser == null)
            {
                return new ApiResponse<UserDTO>(null, null, "400", "Failed to update user", false, 0, 0, 0, 0, null, null);
            }
            var updatedUserDTO = await _userService.GetUserDTOAsync(updatedUser.Id);
            if (updatedUserDTO == null)
            {
                return new ApiResponse<UserDTO>(null, null, "400", "Failed to get user information", false, 0, 0, 0, 0, null, null);
            }
            return new ApiResponse<UserDTO>(null, updatedUserDTO, "200", "Update User successfully", true, 0, 0, 0, 0, null, null);

        }

        [HttpDelete("{id}")]
        public async Task<ApiResponse<User>> DeleteUser(string Id)
        {
            if (string.IsNullOrEmpty(Id))
            {
                return new ApiResponse<User>(null, null, "400", "Id is require", false, 0, 0, 0, 0, null, null);
            }
            Guid guidId = Guid.Parse(Id);
            bool isDeleteSuccess = await _userService.DeleteUserAsync(guidId);
            if (!isDeleteSuccess)
            {
                return new ApiResponse<User>(null, null, "400", "Failed to delete user", false, 0, 0, 0, 0, null, null);

            }
            return new ApiResponse<User>(null, null, "200", "Delete User successfully", true,0,0,0,0, null, null);
        }









    }
}
