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
            // update with pagination
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

    }
}
