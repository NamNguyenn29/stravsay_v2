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
    public class ServiceController : ControllerBase
    {
        private readonly IServiceService _serviceService;

        public ServiceController(IServiceService serviceService)
        {
            _serviceService = serviceService;
        }

        [HttpGet]
        public async Task<ApiResponse<Service>> GetAll()
        {
            List<Service> services = (List<Service>)await _serviceService.GetAllServiceAsync();
            ApiResponse<Service> _apiResponse = new ApiResponse<Service>(0, 0, services, null, "200", "Get all service successfully", true, null, 0);
            return _apiResponse;
        }
            [HttpGet("{id}")]
        public async Task<ApiResponse<Service>> GetServiceById(string id)
        {
            ApiResponse<Service> _apiResponse;
            if (String.IsNullOrWhiteSpace(id))
            {
                return _apiResponse = new ApiResponse<Service>(0, 0, null, null, "404", "Bad request", false, null, 0);
            }
            Guid idGuid = Guid.Parse(id);
            var service = await _serviceService.GetServiceByIdAsync(idGuid);
                if (service == null)
                {
                    return _apiResponse = new ApiResponse<Service>(0, 0, null, null, "404", "Service not found", false, null, 0);
                }

                _apiResponse = new ApiResponse<Service>(0, 0, null, service, "200", "Get service successfully", true, null, 0);
                return _apiResponse;
            }
        
    }
}
