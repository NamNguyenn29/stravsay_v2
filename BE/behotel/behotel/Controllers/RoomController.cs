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

        public RoomController(IRoomService roomImpl)
        {
            _roomImpl = roomImpl;
        }


        [HttpGet]
        public async Task<ApiResponse<RoomDTO>> GetAll()
        {
            var rooms = await _roomImpl.GetAllRoomAsync();
            var roomDTOS = new List<RoomDTO>();
            foreach (var room in rooms)
            {
                var roomDTO = await _roomImpl.GetRoomDTOByIdAsync(room.Id);
                if(roomDTO != null)
                {
                    roomDTOS.Add(roomDTO);
                }
            }
            ApiResponse<RoomDTO> _apiResponse = new ApiResponse<RoomDTO>(0, 0, roomDTOS, null, "200", "Get all rooms successfully", true, null, 0);
            return _apiResponse;
        }
        [HttpGet("{id}")]
        public async Task<ApiResponse<RoomDTO>> GetRomById(string id)
        {
            ApiResponse<RoomDTO> _apiResponse;
            if (String.IsNullOrWhiteSpace(id))
            {
                return _apiResponse = new ApiResponse<RoomDTO>(0, 0, null, null, "404", "Bad request", false, null, 0);
            }
            Guid idGuid = Guid.Parse(id);
            var room = await _roomImpl.GetRoomDTOByIdAsync(idGuid);
            if (room == null)
            {
                return _apiResponse = new ApiResponse<RoomDTO>(0, 0, null, null, "404", "Room not found", false, null, 0);
            }

            _apiResponse = new ApiResponse<RoomDTO>(0, 0, null, room, "200", "Get room successfully", true, null, 0);
            return _apiResponse;
        }

        [HttpPost]
        public async Task<ApiResponse<RoomDTO>> CreateRoom([FromBody] RoomRequest newRoom)
        {
            if (!ModelState.IsValid)
            {
                var errorMessages = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                var combinedErrors = string.Join("; ", errorMessages);
                return new ApiResponse<RoomDTO>(0, 0, null, null, "400", combinedErrors, false, null, 0);
            }
            var Room = await _roomImpl.CreateRoomAsync(newRoom);
            if (Room == null)
            {
                return new ApiResponse<RoomDTO>(0, 0, null, null, "400", "Room number was exists", false, null, 0);
            }
            var RoomDTO = await _roomImpl.GetRoomDTOByIdAsync(Room.Id);
            return new ApiResponse<RoomDTO>(0, 0, null, RoomDTO, "200", "Create room successfully", true, null, 0);
        }

        [HttpPut("{id}")]
        public async Task<ApiResponse<RoomDTO>> UpdateRoom(string id, [FromBody] RoomRequest roomRequest)
        {
            if (string.IsNullOrEmpty(id))
            {
                return new ApiResponse<RoomDTO>(0, 0, null, null, "400", "Room id can not be nulll", false, null, 0);
            }
            Guid guidId = Guid.Parse(id);
            if (!ModelState.IsValid)
            {
                var errorMessages = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                var combinedErrors = string.Join("; ", errorMessages);
                return new ApiResponse<RoomDTO>(0, 0, null, null, "400", combinedErrors, false, null, 0);
            }
            var room = await _roomImpl.UpdateRoomAsync(guidId, roomRequest);
            if (room == null)
            {
                return new ApiResponse<RoomDTO>(0, 0, null, null, "400", "Failed to create room", false, null, 0);
            }
            var RoomDTO = await _roomImpl.GetRoomDTOByIdAsync(guidId);
            return new ApiResponse<RoomDTO>(0, 0, null, RoomDTO, "200","Create room successfully", true, null, 0);
        }

        [HttpDelete("{id}")]
        public async Task<ApiResponse<Room>> DeleteRoom(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return new ApiResponse<Room>(0, 0, null, null, "400", "Room id can not be null", false, null, 0);
            }
            Guid idGuid = Guid.Parse(id);
            var isDeleteSuccess = await _roomImpl.DeleteRoomAsync(idGuid);
            if (isDeleteSuccess == false)
            {
                return new ApiResponse<Room>(0, 0, null, null, "400", "Failed to delete room", false, null, 0);
            }
            return new ApiResponse<Room>(0, 0, null, null, "200", "Delete room successfully", true, null, 0);
        }
        }
}
