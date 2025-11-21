using behotel.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.Cmp;
using behotel.Models;

namespace behotel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly GeminiService _geminiService;

        public ChatController(GeminiService geminiService)
        {
            _geminiService = geminiService;
        }

        [HttpPost("chat")]
        public async Task<IActionResult> Chat([FromBody] string prompt)
        {
            if (String.IsNullOrWhiteSpace(prompt))
            {
                {
                    return BadRequest("Promt can not be empty");
                }
            }
            try
            {
                var res = await _geminiService.getChatResponse(prompt);
                return Ok(new ChatResponse { Response = res });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }
    }
}
