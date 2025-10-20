using behotel.Models;

namespace behotel.Interface
{
    public interface IRoomService
    {
        Task<IEnumerable<Room>> GetAllRoomAsync();
        Task<Room?> GetRoomByIdAsync(Guid id);
        Task<Room> CreateRoomAsync(Room room);
        Task <bool> DeleteRoomAsync(Guid id);
    }
}
