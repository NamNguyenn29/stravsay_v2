using behotel.Models;
using behotel.DTO;

namespace behotel.Interface
{
    public interface IRoomService
    {
        Task<IEnumerable<Room>> GetAllRoomAsync();
        Task<Room?> GetRoomByIdAsync(Guid id);
        Task<Room?> CreateRoomAsync(RoomRequest newRoom);
        Task <bool> DeleteRoomAsync(Guid id);

        Task<RoomDTO?> GetRoomDTOByIdAsync(Guid id);

        Task<Room?> updateRoomAsync(Guid id,RoomRequest roomRequest);
    }


}
