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
    public class RoomController : ControllerBase
    {
        private readonly IRoomService _roomImpl;

        public RoomController (IRoomService roomImpl)
        {
            _roomImpl = roomImpl;
        }


        [HttpGet]
        public async Task<ApiResponse<RoomDTO>> GetAll()
        {
            var rooms = await _roomImpl.GetAllRoomAsync();
            var roomDTOS = new List<RoomDTO>();
            foreach (var room in rooms) {
                roomDTOS.Add(await _roomImpl.GetRoomDTOByIdAsync(room.Id));
            }
            ApiResponse<RoomDTO> _apiResponse = new ApiResponse<RoomDTO>(0, 0, roomDTOS, null, "200", "Get all rooms successfully", true, null, 0);
            return _apiResponse;
        }
        [HttpGet("id")]
        public async Task<ApiResponse<RoomDTO>> GetRomById(string idString)
        {
            ApiResponse<RoomDTO> _apiResponse;
            if (String.IsNullOrWhiteSpace(idString))
            {
                _apiResponse = new ApiResponse<RoomDTO>(0, 0, null, null, "404", "Bad request", false, null, 0);
            }
            Guid id = Guid.Parse(idString);
            var room = await _roomImpl.GetRoomDTOByIdAsync(id);
            if (room == null)
            {
                _apiResponse = new ApiResponse<RoomDTO>(0, 0, null, null, "404", "Room not found", false, null, 0);
            }

            _apiResponse = new ApiResponse<RoomDTO>(0, 0, null, room, "200", "Get room successfully", true, null, 0);
            return _apiResponse;
        }
        
    }
}
