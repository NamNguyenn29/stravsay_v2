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
    public class  BookingController: ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpGet]
        public async Task<ApiResponse<BookingDTO>> GetAll() {
            var bookings = await _bookingService.GetAllBookingAsync();
            var bookingDTOs = new List<BookingDTO>();
            foreach (var booking in bookings)
            {
                var bookingDTO = await _bookingService.GetBookingDTOByIdAsync(booking.Id);
                if(bookingDTO != null)
                {
                    bookingDTOs.Add(bookingDTO);
                }

            }
            ApiResponse<BookingDTO> _apiResponse = new ApiResponse<BookingDTO>(0, 0, bookingDTOs, null, "200", "Get booking successfully", true, null, 0);
            return _apiResponse;
        }

        [HttpGet("{id}")]
        public async Task<ApiResponse<BookingDTO>> GetBokingById(string id) 
        {
            ApiResponse<BookingDTO> _apiResponse;
            if (String.IsNullOrWhiteSpace(id))
            {
                return _apiResponse = new ApiResponse<BookingDTO>(0, 0, null, null, "404", "Bad request", false, null, 0);
            }
            Guid idGuid = Guid.Parse(id);
            var booking = await _bookingService.GetBookingDTOByIdAsync(idGuid);
            if (booking == null)
            {
                return _apiResponse = new ApiResponse<BookingDTO>(0, 0, null, null, "404", "Booking not found", false, null, 0);
            }

            _apiResponse = new ApiResponse<BookingDTO>(0, 0, null, booking, "200", "Get booking successfully", true, null, 0);
            return _apiResponse;
        }

    }
}
