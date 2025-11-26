using behotel.DTO;
using behotel.Helper;
using behotel.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace behotel.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SettingController : ControllerBase
    {
        private readonly ISettingService _settingService;
        public SettingController(ISettingService settingService)
        {
            _settingService = settingService;
        }
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<SettingDTO>>> GetSetting()
        {
            var result = await _settingService.GetSettingAsync();

            if (!result.IsSuccess)
            {
                if (result.Code == "404")
                    return NotFound(result);

                return StatusCode(500, result);
            }

            return Ok(result);
        }
        [HttpPut]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<ApiResponse<SettingDTO>>> UpdateSetting([FromBody] SettingDTO dto)
        {
            // Validate model state
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors);
                var errorMessage = string.Join("; ", errors.Select(e => e.ErrorMessage));

                return BadRequest(new ApiResponse<SettingDTO>(
                    List: null,
                    Object: null,
                    Code: "400",
                    Message: $"Validation failed: {errorMessage}",
                    IsSuccess: false,
                    CurrentPage: 0,
                    PageSize: 0,
                    TotalPage: 0,
                    TotalElement: 0,
                    String: null,
                    Int: null
                ));
            }

            var result = await _settingService.UpdateSettingAsync(dto);

            if (!result.IsSuccess)
            {
                if (result.Code == "404")
                    return NotFound(result);

                return StatusCode(500, result);
            }

            return Ok(result);
        }
    }
}