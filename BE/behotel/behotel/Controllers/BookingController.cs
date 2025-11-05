using behotel.DTO;
using behotel.Helper;
using behotel.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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
        [Authorize(Roles = "ADMIN")]
        [HttpGet]
        public async Task<ApiResponse<BookingDTO>> GetAll(int currentPage, int pageSize) {
            return  await _bookingService.GetBookingDTOWithPaginationAsync(currentPage,pageSize);
        }



        [Authorize]
        [HttpGet("{id}")]
        public async Task<ApiResponse<BookingDTO>> GetBookingById(string id) 
        {
            if (String.IsNullOrWhiteSpace(id))
            {
                return new ApiResponse<BookingDTO>(null,null, "400", "Id is require", false,0,0,0,0, null, null);
            }
            Guid idGuid = Guid.Parse(id);
            var booking = await _bookingService.GetBookingDTOByIdAsync(idGuid);
            if (booking == null)
            {
                return  new ApiResponse<BookingDTO>( null, null, "404", "Booking not found", false,0,0,0,0, null, null);
            }
            return new ApiResponse<BookingDTO>(null, booking, "200", "Get booking successfully", true,0,0,0,1, null, null);
        }
        [Authorize]
        [HttpGet("/userbooking")]
        public async Task<ApiResponse<BookingDTO>> GetBookingsByUserId()
        {
            var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Guid idGuid = Guid.Parse(id);
            return await _bookingService.GetBookingDTOsForUserAsync(idGuid);
        }

        [Authorize]
        [HttpPost]
        public async Task<ApiResponse<BookingDTO>> CreateBooking([FromBody] NewBooking newBooking)
        {
            if(!ModelState.IsValid)
            {
                var errorMessages = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                var combinedErrors = string.Join("; ", errorMessages);
                return  new ApiResponse<BookingDTO>(null, null, "400", combinedErrors, false, 0, 0, 0, 0, null, null);
            }
            return await _bookingService.CreateBookingAsync(newBooking);

        }

        [Authorize(Roles ="ADMIN")]
        [HttpPatch("{id}/approve")]
        public async Task<ApiResponse<BookingDTO>> ApproveBooking(string id)
        {
            if(string.IsNullOrEmpty(id))
            {
                return new ApiResponse<BookingDTO>(null, null, "400", "Id is require", false, 0, 0, 0, 0, null, 0);
            }
            if (!Guid.TryParse(id, out Guid guidId))
            {
                return new ApiResponse<BookingDTO>(null, null, "400", "Invalid GUID format", false, 0, 0, 0, 0, null, null);
            }
            return await _bookingService.ApproveBookingAsync(guidId);

        }

        [Authorize]
        [HttpPatch("{id}/cancel")]
        public async Task<ApiResponse<string>> CancelBooking(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return new ApiResponse<string>(null, null, "400", "Id is require", false, 0, 0, 0, 0, null, 0);
            }
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Guid userIdGuid = Guid.Parse(userId);
            if (!Guid.TryParse(id, out Guid guidId))
            {
                return new ApiResponse<string>(null, null, "400", "Invalid GUID format", false, 0, 0, 0, 0, null, null);
            }
            return await _bookingService.CancelBookingAsync(guidId,userIdGuid);

        }


        [Authorize (Roles ="ADMIN")]
        [HttpDelete]
        public async Task<ApiResponse<string>> DeleteBooking(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return new ApiResponse<string>(null, null, "400", "Id is require", false, 0, 0, 0, 0, null, 0);
            }
            if (!Guid.TryParse(id, out Guid guidId))
            {
                return new ApiResponse<string>(null, null, "400", "Invalid GUID format", false, 0, 0, 0, 0, null, null);
            }
            return await _bookingService.SoftDeleteBookingAsync(guidId);

        }




    }
}
