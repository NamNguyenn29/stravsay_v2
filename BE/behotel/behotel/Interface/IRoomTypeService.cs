using behotel.Models;
namespace behotel.Interface
{
    public interface IRoomTypeService
    {
        Task<IEnumerable<RoomType>> GetAllRoomTypeAsync();
        Task<RoomType?> GetRoomTypeByIdAsync(Guid id);
        Task<RoomType> CreateRoomTypeByIdAsync(RoomType roomType);
        Task<bool> DeleteRoomTypeByIdAsync(Guid id);
    }
}
