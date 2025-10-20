using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using behotel.Interface;

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
        public async Task<IActionResult> GetAll() 
        {
            var services = await _serviceService.GetAllServiceAsync();
            return Ok(services);
        }
        [HttpGet("id")]
        public async Task<IActionResult> GetServiceById(Guid id)
        {
            var service = await _serviceService.GetServiceByIdAsync(id);
            if (service == null)
            {
                return NotFound();
            }
            return Ok(service);
        }
        
    }
}
