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
    public class SupportRequestController : ControllerBase
    {
        private readonly ISupportRequestService _supportRequestService; 
        public SupportRequestController(ISupportRequestService supportRequestService)
        {
            _supportRequestService = supportRequestService;
        }

        [HttpGet]
        public async Task<ApiResponse<SupportRequest>> GetAll()
        {
           
            List<SupportRequest> supportRequests = (List<SupportRequest>)await _supportRequestService.GetAllSupportRequestAsync();
            ApiResponse<SupportRequest> _apiResponse = new ApiResponse<SupportRequest>(0, 0, supportRequests, null, "200", "Get all request successfully", true, null, 0);
            return _apiResponse;

        }
        [HttpGet("id")]
        public async Task<ApiResponse<SupportRequest>> GetResponseById(string idString)
        {
            ApiResponse<SupportRequest> _apiResponse;
            if (String.IsNullOrWhiteSpace(idString))
            {
                _apiResponse = new ApiResponse<SupportRequest>(0, 0, null, null, "404", "Bad request", false, null, 0);
            }
            Guid id = Guid.Parse(idString);
            var supportRequest = await _supportRequestService.GetSupportRequestByIdAsync(id);
            if (supportRequest == null)
            {
                _apiResponse = new ApiResponse<SupportRequest>(0, 0, null, null, "404", "Request not found", false, null, 0);
            }
            _apiResponse = new ApiResponse<SupportRequest>(0, 0, null, supportRequest, "200", "Get request successfully", true, null, 0);
            return _apiResponse;
        }
    }
}
