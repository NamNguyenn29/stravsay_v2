using behotel.DTO;
using behotel.Helper;
using behotel.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace behotel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService )
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            ApiResponse<UserDTO> _apiResponse = new ApiResponse<UserDTO>();
            var users = await _userService.GetAllUsersAsync();
            var UserDTOs = new List<UserDTO>();
            foreach (var user in users)
            {
                UserDTOs.Add(await _userService.GetUserDTOAsync(user.Id));
            }
            _apiResponse.List = UserDTOs;
            return Ok(_apiResponse);
        }

        [HttpGet("id")]
        public async Task<IActionResult> GetUserById(Guid id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound("User not Found");
            }
            return Ok(user);
        }

       

    }
}
