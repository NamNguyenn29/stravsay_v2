
using behotel.Models;
using Microsoft.EntityFrameworkCore;

namespace behotel.Interface.Implement
{
    public class RoomTypeService : IRoomTypeService
    {
        private readonly HotelManagementContext _context;
        public RoomTypeService(HotelManagementContext context)
        {
            _context = context;
        }

        public async Task<RoomType> CreateRoomTypeByIdAsync(RoomType roomType)
        {
            _context.RoomType.Add(roomType);
            await _context.SaveChangesAsync();
            return roomType;
        }

        public async Task<bool> DeleteRoomTypeByIdAsync(Guid id)
        {
           var roomType = await _context.RoomType.FindAsync(id);
            if(roomType == null)
            {
                return false;
            }
            _context.Remove(roomType);
            _context.SaveChanges();
            return true;
        }

        public async Task<IEnumerable<RoomType>> GetAllRoomTypeAsync()
        {
            return await _context.RoomType.ToListAsync();
        }

        public async Task<RoomType?> GetRoomTypeByIdAsync(Guid id)
        {
            return await _context.RoomType.FindAsync(id);
        }
    }
}
