using behotel.DTO;
using behotel.Models;
using Microsoft.EntityFrameworkCore;

namespace behotel.Interface.Implement
{
    public class RoomImpl : IRoomService
    {
        private readonly HotelManagementContext _context;
        public RoomImpl (HotelManagementContext context)
        {
            _context = context;
        }
        public async Task<Room?> CreateRoomAsync(RoomRequest newRoom)
        {
            var roomByNumber = await _context.Room.FirstOrDefaultAsync(r => r.RoomNumber == newRoom.RoomNumber);
            if (roomByNumber != null)
            {
                return null;
            }
            Room room = new Room()
            {
                Id = new Guid(),
                RoomName = newRoom.RoomName,
                RoomNumber = newRoom.RoomNumber,
                IsAvailable = true,
                RoomTypeID = newRoom.RoomTypeID,
                Description = newRoom.Description,
                ImageUrl = String.Join(",",newRoom.ImageUrl),
                Floor = newRoom.Floor,
                Status = 1,
                CreatedDate = DateTime.Now
            };
            _context.Room.Add(room);
            await _context.SaveChangesAsync();
            return room;
        }

        public async Task<bool> DeleteRoomAsync(Guid id)
        {
            var room = await _context.Room.FindAsync(id);
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

        public async Task<RoomDTO?> GetRoomDTOByIdAsync(Guid id)
        {
           var roomOrigin = await _context.Room.FindAsync(id);
            if (roomOrigin == null)
            {
                return null;
            }
            var roomType = await _context.RoomType.FindAsync(roomOrigin.RoomTypeID);
            if (roomType == null)
            {
                return null;
            }
            var roomDTO = new RoomDTO();
            roomDTO.Id = roomOrigin.Id;
            roomDTO.RoomNumber = roomOrigin.RoomNumber;
            roomDTO.RoomName = roomOrigin.RoomName;
            roomDTO.Description = roomOrigin.Description;
            roomDTO.ImageUrl =  roomOrigin.ImageUrl.Split(",");
            roomDTO.Floor = roomOrigin.Floor;
            roomDTO.Status = roomOrigin.Status;
            roomDTO.CreatedDate = roomOrigin.CreatedDate;
            roomDTO.TypeName = roomType.TypeName;
            roomDTO.BasePrice = roomType.BasePrice;
            roomDTO.BedType = roomType.BedType;
            roomDTO.Space = roomType.Space;
            roomDTO.Adult = roomType.Adult;
            roomDTO.Children = roomType.Children;
            roomDTO.HasBreakFast = roomType.HasBreakFast;
            return roomDTO;
        }

        public async Task<Room?> updateRoomAsync(Guid id,RoomRequest roomRequest)
        {
           var roomOrigin = await GetRoomByIdAsync(id);
            if(roomOrigin == null)
            {
                return null;
            }
            roomOrigin.RoomNumber = roomRequest.RoomNumber;
            roomOrigin.RoomName = roomRequest.RoomName;
            roomOrigin.Description = roomRequest.Description;
            roomOrigin.ImageUrl = String.Join(",", roomRequest.ImageUrl);
            roomOrigin.Floor = roomRequest.Floor;
            roomOrigin.RoomTypeID = roomRequest.RoomTypeID;
            await _context.SaveChangesAsync();
            return roomOrigin;
        }
    }
}
