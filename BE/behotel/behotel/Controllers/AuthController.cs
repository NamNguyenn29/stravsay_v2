using Azure.Core;
using behotel.DTO;
using behotel.Helper;
using behotel.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace behotel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IUserService _userService;
        private readonly ISystemLogService _systemLogService; 

        public AuthController(
            IConfiguration config,
            IUserService userService,
            ISystemLogService systemLogService) 
        {
            _config = config;
            _userService = userService;
            _systemLogService = systemLogService; 
        }

        [HttpPost("login")]
        public async Task<ApiResponse<string>> Login([FromBody] LoginModel loginModel)
        {
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";

            if (!ModelState.IsValid)
            {
                var errorMessages = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                var combinedErrors = string.Join("; ", errorMessages);

                await _systemLogService.CreateLogAsync(null, ipAddress, false, "LoginFailed");

                return new ApiResponse<string>(null, null, "400", combinedErrors, false, 0, 0, 0, 0, null, null);
            }

            var userByEmail = await _userService.GetUserByEmailAsync(loginModel.Email);
            if (userByEmail == null)
            {
                await _systemLogService.CreateLogAsync(null, ipAddress, false, "LoginFailed");

                return new ApiResponse<string>(null, null, "400", "Account is not exists", false, 0, 0, 0, 0, null, null);
            }

            if (userByEmail.IsActived == false)
            {
                await _systemLogService.CreateLogAsync(userByEmail.Id, ipAddress, false, "LoginFailed");

                return new ApiResponse<string>(null, null, "400", "Inactive Account", false, 0, 0, 0, 0, null, null);
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginModel.Password, userByEmail.Password);
            if (!isPasswordValid)
            {
                await _systemLogService.CreateLogAsync(userByEmail.Id, ipAddress, false, "LoginFailed");

                return new ApiResponse<string>(null, null, "400", "InCorrect Information", false, 0, 0, 0, 0, null, null);
            }

            var userDTO = await _userService.GetUserDTOAsync(userByEmail.Id);
            if (userDTO == null)
            {
                await _systemLogService.CreateLogAsync(userByEmail.Id, ipAddress, false, "LoginFailed");

                return new ApiResponse<string>(null, null, "400", "Failed to load Information", false, 0, 0, 0, 0, null, null);
            }

            loginModel.Roles = userDTO.RoleList;

            var accessToken = GenerateAccessToken(userDTO.Id.ToString(), loginModel.Email, loginModel.Roles);
            var cookieOptionsForACToken = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddHours(1)
            };

            var refreshToken = GenerateRefreshToken(userDTO.Id.ToString(), loginModel.Email, loginModel.Roles);
            await _userService.SaveRefreshToken(userDTO.Id, refreshToken);

            var cookiesOptionsForRFToken = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            var roleJson = JsonSerializer.Serialize(userDTO.RoleList);
            Response.Cookies.Append("accessToken", accessToken, cookieOptionsForACToken);
            Response.Cookies.Append("refreshToken", refreshToken, cookiesOptionsForRFToken);
            Response.Cookies.Append("roles", roleJson, new CookieOptions
            {
                HttpOnly = false,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/",
                Expires = DateTime.UtcNow.AddHours(1)
            });


            await _systemLogService.CreateLogAsync(userDTO.Id, ipAddress, true, "Login");

            return new ApiResponse<string>(null, accessToken, "200", "Login successfully", true, 0, 0, 0, 0, null, null);
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<ApiResponse<string>> Logout() 
        {

            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";


            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Guid? userId = null;

            if (Guid.TryParse(userIdClaim, out Guid parsedUserId))
            {
                userId = parsedUserId;
            }

            Response.Cookies.Delete("accessToken", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/"
            });
            Response.Cookies.Delete("refreshToken", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/"
            });
            Response.Cookies.Delete("roles", new CookieOptions
            {
                HttpOnly = false,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/"
            });
            await _systemLogService.CreateLogAsync(userId, ipAddress, true, "Logout");

            return new ApiResponse<string>(null, null, "200", "Logout successfully", true, 0, 0, 0, 0, null, null);
        }

        [AllowAnonymous]
        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
            {
                return Unauthorized(new { message = "No refresh token provided" });
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            try
            {
                var principal = tokenHandler.ValidateToken(refreshToken, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:Key"])),
                    ValidateIssuer = true,
                    ValidIssuer = _config["Jwt:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = _config["Jwt:Audience"],
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero,
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;

                var user = await _userService.GetUserByRefreshTokenAsync(refreshToken);
                if (user == null)
                {
                    return Unauthorized(new { message = "Invalid refresh token" });
                }

                var userDTO = await _userService.GetUserDTOAsync(user.Id);

                var newAccessToken = GenerateAccessToken(user.Id.ToString(), user.Email, userDTO.RoleList);
                var cookieOptionsForACToken = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddHours(1)
                };
                Response.Cookies.Append("accessToken", newAccessToken, cookieOptionsForACToken);
                var roleJson = JsonSerializer.Serialize(userDTO.RoleList);
                Response.Cookies.Append("roles", roleJson, new CookieOptions
                {
                    HttpOnly = false,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Path = "/",
                    Expires = DateTime.UtcNow.AddHours(1),
                });

                return Ok(new { message = "Access token refreshed successfully" });
            }
            catch (SecurityTokenExpiredException)
            {
                return Unauthorized("Refresh token expired");
            }
            catch (Exception ex)
            {
                return Unauthorized("Invalid refresh token");
            }
        }

        private string GenerateAccessToken(string id, string email, List<string> roles)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, id),
                new Claim(ClaimTypes.Email, email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken(string id, string email, List<string> roles)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, id),
                new Claim(ClaimTypes.Email, email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}