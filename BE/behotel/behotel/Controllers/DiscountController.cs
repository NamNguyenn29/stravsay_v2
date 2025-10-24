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
    public class DiscountController : ControllerBase
    {
        private readonly IDiscountService _discountService;
        public DiscountController(IDiscountService discountService)
        {
            _discountService = discountService;
        }

        [HttpGet]
        public async Task<ApiResponse<Discount>> GetAll()
        { 
            List<Discount> discounts = (List<Discount>)await _discountService.GetAllDiscountAsync();
            ApiResponse<Discount> _apiResponse = new ApiResponse<Discount>(0, 0, discounts, null, "200", "Get all discount successfully", true, null, 0);
            return _apiResponse;
        }

        [HttpGet("id")]
        public async Task<ApiResponse<Discount>> GetDiscountById(string idString)
        {
            ApiResponse<Discount> _apiResponse;
            if (String.IsNullOrWhiteSpace(idString))
            {
                _apiResponse = new ApiResponse<Discount>(0, 0, null, null, "404", "Bad request", false, null, 0);
            }
            Guid id = Guid.Parse(idString);
            var discount = await _discountService.GetDiscountByIdAsync(id);
            if (discount == null)
            {
                _apiResponse = new ApiResponse<Discount>(0, 0, null, null, "404", "Discount not found", false, null, 0);
            }

            _apiResponse = new ApiResponse<Discount>(0, 0, null, discount, "200", "Get discount successfully", true, null, 0);
            return _apiResponse;
        }
    }
}
