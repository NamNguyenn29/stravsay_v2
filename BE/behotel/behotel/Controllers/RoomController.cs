using behotel.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace behotel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly IRoomService _roomService;

        public RoomController (IRoomService roomService)
        {
            _roomService = roomService;
        }


        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var rooms = await _roomService.GetAllRoomAsync();
            return Ok(rooms);
        }
        [HttpGet("id")]
        public async Task<IActionResult> GetRomById(Guid id)
        {
            var room = await _roomService.GetRoomByIdAsync(id);
            if(room == null)
            {
                return NotFound("Room Not Found");
            }
            return Ok(room);
        }
        
    }
}
