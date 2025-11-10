using behotel.Models;
using behotel.DTO;
using behotel.Helper;

namespace behotel.Interface
{
    public interface IRoomService
    {
        Task<IEnumerable<Room>> GetAllRoomAsync();

        Task<ApiResponse<RoomDTO>> GetRoomsWithPaginationAsync(int currentPage, int pageSize);
        Task<Room?> GetRoomByIdAsync(Guid id);
        Task<Room?> CreateRoomAsync(RoomRequest newRoom);
        Task <bool> DeleteRoomAsync(Guid id);

        Task<RoomDTO?> GetRoomDTOByIdAsync(Guid id);

        Task<Room?> UpdateRoomAsync(Guid id,RoomRequest roomRequest);

        Task<IEnumerable<RoomDTO>?> GetAvailableRoomsAsync(string? selectedTypeId, DateTime checkInDate , DateTime checkOutDate, int Adult, int Children);

        Task<ApiResponse<RoomDTO>> SearchRoomByKeyword(string filter, int currentPage , int pageSize);
    }


}
