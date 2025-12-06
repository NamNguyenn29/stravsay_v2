using behotel.DTO;
using behotel.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace behotel.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DiscountController : ControllerBase
    {
        private readonly IDiscountService _discountService;

        public DiscountController(IDiscountService discountService)
        {
            _discountService = discountService;
        }

        [Authorize(Roles = "ADMIN")]
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int currentPage = 1, [FromQuery] int pageSize = 10)
        {
            var response = await _discountService.GetAllAsync(currentPage, pageSize);

            if (!response.IsSuccess)
            {
                return NotFound(response);
            }

            return Ok(response);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var response = await _discountService.GetByIdAsync(id);

            if (!response.IsSuccess)
            {
                return NotFound(response);
            }

            return Ok(response);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpGet("code/{code}")]
        public async Task<IActionResult> GetByCode(string code)
        {
            var response = await _discountService.GetByCodeAsync(code);

            if (!response.IsSuccess)
            {
                return NotFound(response);
            }

            return Ok(response);
        }

        [Authorize]
        [HttpPost("validate")]
        public async Task<IActionResult> ValidateDiscount([FromBody] DiscountDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.DiscountCode))
            {
                return BadRequest(new { message = "Discount code is required" });
            }
            var response = await _discountService.ValidateAndCalculateAsync(
                dto.DiscountCode,
                dto.MinOrderAmount
            );

            if (!response.IsSuccess)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DiscountDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { message = "Discount data is required" });
            }

            var response = await _discountService.CreateAsync(dto);

            if (!response.IsSuccess)
            {
                return BadRequest(response);
            }

            return CreatedAtAction(nameof(GetById), new { id = response.Object.Id }, response);
        }
        [Authorize(Roles = "ADMIN")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] DiscountDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { message = "Discount data is required" });
            }

            var response = await _discountService.UpdateAsync(id, dto);

            if (!response.IsSuccess)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var response = await _discountService.DeleteAsync(id);

            if (!response.IsSuccess)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

    }
}