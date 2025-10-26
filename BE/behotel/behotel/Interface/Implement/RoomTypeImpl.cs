
using behotel.DTO;
using behotel.Models;
using Microsoft.EntityFrameworkCore;

namespace behotel.Interface.Implement
{
    public class RoomTypeImpl : IRoomTypeService
    {
        private readonly HotelManagementContext _context;
        public RoomTypeImpl(HotelManagementContext context)
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
            if (roomType == null)
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

        public async Task<RoomTypeDTO?> GetRoomTypeDTOByID(Guid id)
        {
            var RoomTypeOrigin = await _context.RoomType.FindAsync(id);
            if (RoomTypeOrigin == null)
            {
                return null;
            }
            RoomTypeDTO roomTypeDTO = new RoomTypeDTO()
            {
                Id = id,
                TypeName = RoomTypeOrigin.TypeName
            };
            return roomTypeDTO;

        }
    }
}
