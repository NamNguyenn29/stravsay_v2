using behotel.DTO;
using behotel.Helper;
using behotel.Interface;
using behotel.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace behotel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiscountController : ControllerBase
    {
        private readonly IDiscountService _discountService;
        public DiscountController(IDiscountService discountService)
        {
            _discountService = discountService;
        }

        [Authorize(Roles ="ADMIN")]
        [HttpGet]
        public async Task<ApiResponse<Discount>> GetAll()
        {
            // update with panigation
            List<Discount> discounts = (List<Discount>)await _discountService.GetAllDiscountAsync();
            ApiResponse<Discount> _apiResponse = new ApiResponse<Discount>( discounts, null, "200", "Get all discount successfully", true,0,0,0,0, null, 0);
            return _apiResponse;
        }
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ApiResponse<Discount>> GetDiscountById(string id)
        {
            if (String.IsNullOrWhiteSpace(id))
            {
                return new ApiResponse<Discount>(null, null, "400", "is is require", false, 0, 0, 0, 0, null, null);
            }
            Guid idGuid = Guid.Parse(id);
            var discount = await _discountService.GetDiscountByIdAsync(idGuid);
            if (discount == null)
            {
                return new ApiResponse<Discount>(null, null, "404", "Discount not found", false, 0, 0, 0, 0 ,null, null);
            }

            return new ApiResponse<Discount>(null, discount, "200", "Get discount successfully", true,0,0,0,1, null, null);
        }

        // create 
        // update
        // remove
    }
}
