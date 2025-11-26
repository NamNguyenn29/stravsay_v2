using behotel.DTO;
using behotel.Helper;
using behotel.Helper.SendMail;
using behotel.Interface;
using behotel.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace behotel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IUserSoftDeleteService _userSoftDeleteService;

        public UserController(IUserService userService, IUserSoftDeleteService userSoftDelete)
        {
            _userService = userService;
            _userSoftDeleteService = userSoftDelete;

        }
        [Authorize(Roles = "ADMIN")]
        [HttpGet]
        public async Task<ApiResponse<UserDTO>> GetAll(int currentPage, int pageSize)
        {

            return await _userService.GetUsersWithPaginationAsync(currentPage, pageSize);

        }
        [Authorize]
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
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ApiResponse<UserDTO>> Register(UserRegister userRegister)
        {
            if (!ModelState.IsValid)
            {
                var errorMessages = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                var combinedErrors = string.Join("; ", errorMessages);
                return new ApiResponse<UserDTO>(null, null, "400", combinedErrors, false, 0, 0, 0, 0, null, null);
            }
            var existingUser = await _userService.GetUserByEmailAsync(userRegister.Email);
            if (existingUser != null)
            {
                return new ApiResponse<UserDTO>(null, null, "400", "Email already exists", false, 0, 0, 0, 0, null, null);
            }
            int workFactor = 12;
            string hashed = BCrypt.Net.BCrypt.HashPassword(userRegister.Password, workFactor);

            var registeredUser = await _userService.ResgisterUser(userRegister, hashed);
            return new ApiResponse<UserDTO>(null, registeredUser, "200", "Account registered successfully", true, 0, 0, 0, 1, null, null);
        }


        [AllowAnonymous]
        [HttpGet("activeUser")]
        public async Task<IActionResult> ActiveUser([FromQuery] String email, [FromQuery] String activationCode)
        {
            var apiResponse = await _userService.ActiveUser(email, activationCode);
            return Redirect(apiResponse.String);
        }

        [Authorize]
        [HttpPut("me")]
        public async Task<ApiResponse<UserDTO>> UpdateUser([FromBody] UpdateUser updateUser)
        {
            var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var guidId = Guid.Parse(id);
            if (!ModelState.IsValid)
            {
                var errorMessages = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                var combinedErrors = string.Join("; ", errorMessages);
                return new ApiResponse<UserDTO>(null, null, "400", combinedErrors, false, 0, 0, 0, 0, null, null);
            }


            var updatedUser = await _userService.UpdateUserAsync(guidId, updateUser);
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


        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}")]
        public async Task<ApiResponse<string>> DeleteUser(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return new ApiResponse<string>(null, null, "400", "Id is require", false, 0, 0, 0, 0, null, null);
            }
            if (!Guid.TryParse(id, out Guid guidId))
            {
                return new ApiResponse<string>(null, null, "400", "Invalid GUID format", false, 0, 0, 0, 0, null, null);
            }
            return await _userSoftDeleteService.SoftDeleteUser(guidId);

        }


        [Authorize]
        [HttpGet("me")]
        public async Task<ApiResponse<UserDTO>> GetUser()
        {
            var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
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

        [Authorize]
        [HttpPost("changepassword")]
        public async Task<ApiResponse<UserDTO>> ChangePassword([FromBody] ChangePasswordModel changePasswordModel)
        {
            var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (String.IsNullOrWhiteSpace(id))
            {
                return new ApiResponse<UserDTO>(null, null, "400", "Id is required", false, 0, 0, 0, 0, null, 0);
            }
            Guid idGuid = Guid.Parse(id);
            if (!ModelState.IsValid)
            {
                var errorMessages = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                var combinedErrors = string.Join("; ", errorMessages);
                return new ApiResponse<UserDTO>(null, null, "400", combinedErrors, false, 0, 0, 0, 0, null, null);
            }
            return await _userService.ChangePassword(idGuid, changePasswordModel);

        }

        [AllowAnonymous]
        [HttpPost("forgotpassword")]
        public async Task<ApiResponse<string>> ForgotPassword([FromBody] string email)
        {
            return await _userService.CheckEmailExists(email);
        }

        [AllowAnonymous]
        [HttpGet("checkToken")]
        public async Task<ApiResponse<string>> CheckToken([FromQuery] string email, [FromQuery] string token)
        {
            return await _userService.CheckResetToken(email, token);
        }

        [AllowAnonymous]
        [HttpPost("resetpassword")]
        public async Task<ApiResponse<string>> ResetPassword([FromBody] ResetPasswordModel resetPasswordModel)
        {
            return await _userService.ResetPassword(resetPasswordModel);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpGet("search")]
        public async Task<ApiResponse<UserDTO>> SearchUser([FromQuery] string filter, [FromQuery] int currentPage, [FromQuery] int pageSize)
        {
            return await _userService.SearchUserKeyword(filter, currentPage, pageSize);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPut("{id}/status")]
        public async Task<ApiResponse<UserDTO>> EditUserStatus(Guid id, [FromBody] int status)
        {
            return await _userService.EditUserStatus(id, status);
        }
        
        
        











    }
}
