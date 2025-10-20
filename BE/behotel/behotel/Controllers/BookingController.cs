using behotel.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace behotel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class  BookingController: ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() {
            var bookings = await _bookingService.GetAllBookingAsync();
            return Ok(bookings);
        }

        [HttpGet("id")]
        public async Task<IActionResult> GetBokingById(Guid id) 
        {
            var booking = await _bookingService.GetBookingByIdAsync(id);
            if (booking == null)
            {
                return NotFound();
            }
            return Ok(booking);
        }

    }
}
