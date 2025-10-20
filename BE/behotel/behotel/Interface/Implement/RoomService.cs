using behotel.Models;
using Microsoft.EntityFrameworkCore;

namespace behotel.Interface.Implement
{
    public class RoomService : IRoomService
    {
        private readonly HotelManagementContext _context;
        public RoomService (HotelManagementContext context)
        {
            _context = context;
        }
        public async Task<Room> CreateRoomAsync(Room room)
        {
            // check validate
            _context.Room.Add(room);
            await _context.SaveChangesAsync();
            return room;
        }

        public async Task<bool> DeleteRoomAsync(Guid id)
        {
            Room room = await _context.Room.FindAsync(id);
            if(room == null)
            {
                return false;
            }
            _context.Room.Remove(room);
            await _context.SaveChangesAsync();
            return true; 


        }

        public async Task<IEnumerable<Room>> GetAllRoomAsync()
        {
            return await _context.Room.ToListAsync();
        }

        public async Task<Room?> GetRoomByIdAsync(Guid id)
        {
            return await _context.Room.FindAsync(id);
        }
    }
}
