using behotel.DTO;
using behotel.Helper;
using behotel.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace behotel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomTypeController : ControllerBase
    {
        private readonly IRoomTypeService _roomTypeService;

        public RoomTypeController(IRoomTypeService roomTypeService)
        {
            _roomTypeService = roomTypeService;
        }

        [HttpGet]
        public async Task<ApiResponse<RoomTypeDTO>> GetAll()
        {

            var roomTypes = await _roomTypeService.GetAllRoomTypeAsync();
            var roomTypeDTOs = new List<RoomTypeDTO>();
            foreach (var roomType in roomTypes)
            {
                var roomTypeDTO = await _roomTypeService.GetRoomTypeDTOByID(roomType.Id);
                if (roomTypeDTO != null)
                {
                    roomTypeDTOs.Add(roomTypeDTO);
                }
            }
            ApiResponse<RoomTypeDTO> _apiResponse = new ApiResponse<RoomTypeDTO>(roomTypeDTOs, null, "200", "Get all room types successfully", true,0,0,0,roomTypeDTOs.Count, null, null);
            return _apiResponse;

        }
    }
}
