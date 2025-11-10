using behotel.DTO;
using behotel.Helper;
using behotel.Interface;
using behotel.Models;
using Humanizer;
using Microsoft.AspNetCore.Authorization;
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

        [AllowAnonymous]
        [HttpGet]
        public async Task<ApiResponse<RoomDTO>> GetAll(int currentPage, int pageSize)
        {
            return await _roomImpl.GetRoomsWithPaginationAsync(currentPage, pageSize);
        }


        [AllowAnonymous]
        [HttpGet("available")]
        public async Task<ApiResponse<RoomDTO>> GetAvailableRoom([FromQuery]string? selectedRoomTypeId, [FromQuery] DateTime checkInDate, [FromQuery] DateTime checkOutDate, [FromQuery] int adult, [FromQuery] int children)
        {
            if (checkInDate < DateTime.Now.Date)
            {
                return new ApiResponse<RoomDTO>(
                    null, null, "400",
                    "Check-in date must be today or in the future.",
                    false, 0, 0, 0, 0, null, null
                );
            }

            if (checkOutDate <= checkInDate)
            {
                return new ApiResponse<RoomDTO>(
                    null, null, "400",
                    "Check-out date must be after check-in date.",
                    false, 0, 0, 0, 0, null, null
                );
            }

            var availableRooms = await _roomImpl.GetAvailableRoomsAsync(selectedRoomTypeId, checkInDate, checkOutDate, adult, children);
            if (availableRooms == null)
            {
                return new ApiResponse<RoomDTO>(null, null, "404", "No available room found", false, 0, 0, 0, 0, null, null);
            }
            return new ApiResponse<RoomDTO>(availableRooms.ToList(), null, "200", "Get room successfully", true, 0, 0, 0, availableRooms.Count(), null, null);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ApiResponse<RoomDTO>> GetRoomById(string id)
        {
            if (String.IsNullOrWhiteSpace(id))
            {
                return  new ApiResponse<RoomDTO>(null, null, "400", "Id is require", false,0,0,0,0, null, null);
            }
            Guid idGuid = Guid.Parse(id);
            var room = await _roomImpl.GetRoomDTOByIdAsync(idGuid);
            if (room == null)
            {
                return  new ApiResponse<RoomDTO>(null, null, "404", "Room not found", false,0,0,0,0, null, null);
            }

            return new ApiResponse<RoomDTO>(null, room, "200", "Get room successfully", true,0,0,0,1, null, null);
        }
        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        public async Task<ApiResponse<RoomDTO>> CreateRoom([FromForm] RoomRequest newRoom)
        {
            if (!ModelState.IsValid)
            {
                var errorMessages = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                var combinedErrors = string.Join("; ", errorMessages);
                return new ApiResponse<RoomDTO>(null, null, "400", combinedErrors, false,0,0,0,0, null, null);
            }
            var Room = await _roomImpl.CreateRoomAsync(newRoom);
            if (Room == null)
            {
                return new ApiResponse<RoomDTO>(null, null, "400", "Room number was exists", false,0,0,0,0, null,null);
            }
            var RoomDTO = await _roomImpl.GetRoomDTOByIdAsync(Room.Id);
            return new ApiResponse<RoomDTO>(null, RoomDTO, "200", "Create room successfully", true,0,0,0,1, null, null);
        }
        [Authorize(Roles ="ADMIN")]
        [HttpPut("{id}")]
        public async Task<ApiResponse<RoomDTO>> UpdateRoom(string id, [FromForm] RoomRequest roomRequest)
        {
            if (string.IsNullOrEmpty(id))
            {
                return new ApiResponse<RoomDTO>(null, null, "400", "Id is require", false,0,0,0,0, null, null);
            }
            Guid guidId = Guid.Parse(id);
            if (!ModelState.IsValid)
            {
                var errorMessages = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                var combinedErrors = string.Join("; ", errorMessages);
                return new ApiResponse<RoomDTO>(null, null, "400", combinedErrors, false, 0, 0, 0, 0, null, null);
            }
            var room = await _roomImpl.UpdateRoomAsync(guidId, roomRequest);
            if (room == null)
            {
                return new ApiResponse<RoomDTO>(null, null, "400", "Failed to create room", false, 0, 0, 0, 0, null,null);
            }
            var RoomDTO = await _roomImpl.GetRoomDTOByIdAsync(guidId);
            return new ApiResponse<RoomDTO>(null, RoomDTO, "200","Create room successfully", true, 0, 0, 0, 1, null, null);
        }

        [Authorize(Roles ="ADMIN")]
        [HttpDelete("{id}")]
        public async Task<ApiResponse<Room>> DeleteRoom(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return new ApiResponse<Room>(null, null, "400", "Id is require", false, 0, 0, 0, 0, null, null);
            }
            Guid idGuid = Guid.Parse(id);
            var isDeleteSuccess = await _roomImpl.DeleteRoomAsync(idGuid);
            if (isDeleteSuccess == false)
            {
                return new ApiResponse<Room>(null, null, "400", "Failed to delete room", false, 0, 0, 0, 0, null, null);
            }
            return new ApiResponse<Room>(null, null, "200", "Delete room successfully", true, 0, 0, 0, 0, null, null);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpGet("search")]
        public async Task<ApiResponse<RoomDTO>> SearchRoom([FromQuery]string filter, [FromQuery]int currentPage, [FromQuery]int pageSize)
        {
            return await _roomImpl.SearchRoomByKeyword(filter, currentPage,pageSize);
        }
    }
}
