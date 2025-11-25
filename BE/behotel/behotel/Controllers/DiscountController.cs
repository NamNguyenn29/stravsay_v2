//using behotel.DTO;
//using behotel.Interface;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;

//namespace behotel.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    public class DiscountController : ControllerBase
//    {
//        private readonly IDiscountService _discountService;

//        public DiscountController(IDiscountService discountService)
//        {
//            _discountService = discountService;
//        }

//        [Authorize]
//        [HttpGet]
//        public async Task<ActionResult<IEnumerable<DiscountDTO>>> GetAll()
//        {
//            try
//            {
//                var dtos = await _discountService.GetAllAsync();
//                return Ok(dtos);
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(new { message = ex.Message });
//            }
//        }

//        [Authorize]
//        [HttpGet("{id}")]
//        public async Task<ActionResult<DiscountDTO>> GetById(Guid id)
//        {
//            try
//            {
//                var dto = await _discountService.GetByIdAsync(id);
//                return Ok(dto);
//            }
//            catch (KeyNotFoundException ex)
//            {
//                return NotFound(new { message = ex.Message });
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(new { message = ex.Message });
//            }
//        }

//        [AllowAnonymous]
//        [HttpGet("code/{code}")]
//        public async Task<ActionResult<DiscountDTO>> GetByCode(string code)
//        {
//            try
//            {
//                var dto = await _discountService.GetByCodeAsync(code);
//                return Ok(dto);
//            }
//            catch (KeyNotFoundException ex)
//            {
//                return NotFound(new { message = ex.Message });
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(new { message = ex.Message });
//            }
//        }

//        [Authorize(Roles = "ADMIN")]
//        [HttpPost]
//        public async Task<ActionResult<DiscountDTO>> Create([FromBody] DiscountDTO dto)
//        {
//            try
//            {
//                var resultDto = await _discountService.CreateAsync(dto);
//                return CreatedAtAction(nameof(GetById), new { id = resultDto.Id }, resultDto);
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(new { message = ex.Message });
//            }
//        }

//        [Authorize(Roles = "ADMIN")]
//        [HttpPut("{id}")]
//        public async Task<ActionResult<DiscountDTO>> Update(Guid id, [FromBody] DiscountDTO dto)
//        {
//            try
//            {
//                var resultDto = await _discountService.UpdateAsync(id, dto);
//                return Ok(resultDto);
//            }
//            catch (KeyNotFoundException ex)
//            {
//                return NotFound(new { message = ex.Message });
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(new { message = ex.Message });
//            }
//        }

//        [Authorize(Roles = "ADMIN")]
//        [HttpDelete("{id}")]
//        public async Task<ActionResult> Delete(Guid id)
//        {
//            try
//            {
//                await _discountService.DeleteAsync(id);
//                return NoContent();
//            }
//            catch (KeyNotFoundException ex)
//            {
//                return NotFound(new { message = ex.Message });
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(new { message = ex.Message });
//            }
//        }

//        [AllowAnonymous]
//        [HttpPost("validate")]
//        public async Task<ActionResult<DiscountDTO>> Validate([FromBody] ValidateDiscountRequest request)
//        {
//            try
//            {
//                var dto = await _discountService.ValidateDiscountAsync(request.Code, request.OrderAmount);
//                return Ok(dto);
//            }
//            catch (KeyNotFoundException ex)
//            {
//                return NotFound(new { message = ex.Message });
//            }
//            catch (InvalidOperationException ex)
//            {
//                return BadRequest(new { message = ex.Message });
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(new { message = ex.Message });
//            }
//        }
//    }

//    public class ValidateDiscountRequest
//    {
//        public string Code { get; set; }
//        public decimal OrderAmount { get; set; }
//    }
//}