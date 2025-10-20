using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using behotel.Interface;

namespace behotel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupportRequestController : ControllerBase
    {
        private readonly ISupportRequestService _supportRequestService; 
        public SupportRequestController(ISupportRequestService supportRequestService)
        {
            _supportRequestService = supportRequestService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var rooms = await _supportRequestService.GetAllSupportRequestAsync();
            return Ok(rooms);
        }
        [HttpGet("id")]
        public async Task<IActionResult> GetResponseById(Guid id)
        {
            var supportRequest = await _supportRequestService.GetSupportRequestByIdAsync(id);
            if (supportRequest == null)
            {
                return NotFound();
            }
            return Ok(supportRequest);
        }
    }
}
