using behotel.DTO;
using behotel.Helper;
using behotel.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace behotel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [Authorize(Roles = "ADMIN")]
        [HttpGet]
        public async Task<IActionResult> GetDashboardData()
        {
            try
            {
                var dashboardData = await _dashboardService.GetDashboardDataAsync();

                var response = new ApiResponse<DashboardDTO>(
                    new List<DashboardDTO> { dashboardData },
                    null,
                    "200",
                    "Get dashboard data successfully",
                    true,
                    0, 0, 0, 1,
                    null, null
                );

                return Ok(response);
            }
            catch (Exception ex)
            {
                var errorResponse = new ApiResponse<DashboardDTO>(
                    null,
                    null,
                    "500",
                    $"Error: {ex.Message}",
                    false,
                    0, 0, 0, 0,
                    null, null
                );
                return StatusCode(500, errorResponse);
            }
        }
    }
}