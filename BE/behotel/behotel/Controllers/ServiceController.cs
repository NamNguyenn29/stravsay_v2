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
            return new ApiResponse<Service>(services, null, "200", "Get all service successfully", true, 0, 0, 0, services.Count, null, null);
        }
            [HttpGet("{id}")]
        public async Task<ApiResponse<Service>> GetServiceById(string id)
        {
            if (String.IsNullOrWhiteSpace(id))
            {
                return new ApiResponse<Service>(null, null, "400", "Id is require", false,0,0,0,0 ,null, null);
            }
            Guid idGuid = Guid.Parse(id);
            var service = await _serviceService.GetServiceByIdAsync(idGuid);
                if (service == null)
                {
                    return new ApiResponse<Service>(null, null, "404", "Service not found", false, 0, 0, 0, 0, null,null);
                }

                return new ApiResponse<Service>(null, service, "200", "Get service successfully", true,0,0,0,0, null, null);
            }
        
    }
}
