using behotel.DTO;
using behotel.Helper;
using behotel.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace behotel.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SystemLogController : ControllerBase
    {
        private readonly ISystemLogService _systemLogRepository;

        public SystemLogController(ISystemLogService systemLogRepository)
        {
            _systemLogRepository = systemLogRepository;
        }

        [HttpGet]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<ApiResponse<SystemLogDTO>>> GetAllLogs(
            [FromQuery] int currentPage = 1,
            [FromQuery] int pageSize = 10)
        {
            var result = await _systemLogRepository.GetAllLogsAsync(currentPage, pageSize);
            if (!result.IsSuccess)
                return StatusCode(500, result);
            return Ok(result);
        }

        [HttpGet("user/{userId}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<SystemLogDTO>>> GetUserLogs(
            Guid userId,
            [FromQuery] int currentPage = 1,
            [FromQuery] int pageSize = 10)
        {
            var result = await _systemLogRepository.GetLogsByUserIdAsync(userId, currentPage, pageSize);
            if (!result.IsSuccess)
                return StatusCode(500, result);
            return Ok(result);
        }


        [HttpDelete("{logId}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<SystemLogDTO>>> DeleteLog(Guid logId)
        {
            var result = await _systemLogRepository.DeleteLogAsync(logId);

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