using behotel.DTO;
using behotel.Helper;
using behotel.Models;
using Microsoft.EntityFrameworkCore;
using System.Configuration;

namespace behotel.Interface.Implement
{
    public class RoomImpl : IRoomService
    {
        private readonly HotelManagementContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly IConfiguration _config;

        private readonly IInProgressBookingService _inProgressBookingService;
        public RoomImpl(HotelManagementContext context, IInProgressBookingService inProgressBookingService, IWebHostEnvironment webHostEnvironment,IConfiguration config)
        {
            _context = context;
            _inProgressBookingService = inProgressBookingService;
            _env = webHostEnvironment;
            _config = config;
        }
        public async Task<Room?> CreateRoomAsync(RoomRequest newRoom)
        {
            var roomByNumber = await _context.Room.FirstOrDefaultAsync(r => r.RoomNumber == newRoom.RoomNumber);
            if (roomByNumber != null)
            {
                return null;
            }
            int status = 0;
            if (newRoom.Status.Equals("Available"))
            {
                status = 1;
            }
            string imageUrls = "";
            foreach (var img in newRoom.ImageUrl)
            {
                var relativPath = await SaveFile(img, "room_images");
                imageUrls += $",{relativPath}";
            }
            Room room = new Room()
            {
                Id = new Guid(),
                RoomName = newRoom.RoomName,
                RoomNumber = newRoom.RoomNumber,
                IsAvailable = true,
                RoomTypeID = Guid.Parse(newRoom.RoomTypeID),
                Description = newRoom.Description,
                Floor = newRoom.Floor,
                ImageUrl = imageUrls,
                Status = status,
                CreatedDate = DateTime.Now
            };
            
            _context.Room.Add(room);
            await _context.SaveChangesAsync();
            return room;
        }

        private async Task<string> SaveFile(IFormFile file, string folderName)
        {
            var folderPath = Path.Combine(_env.WebRootPath, folderName);

            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            fileName = fileName.Replace(" ", "_").Replace("#", "");
            var savePath = Path.Combine(folderPath, fileName);
            using (var stream = new FileStream(savePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/{folderName}/{fileName}";
        }

        public async Task<bool> DeleteRoomAsync(Guid id)
        {
            var room = await _context.Room.FindAsync(id);
            if (room == null)
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

        public async Task<IEnumerable<RoomDTO>?> GetAvailableRoomsAsync(string? selectedTypeId, DateTime checkInDate, DateTime checkOutDate, int Adult, int Children)
        {
            var allRooms = await GetAllRoomAsync();
            List<RoomDTO> filterRooms = new List<RoomDTO>();
            foreach (var room in allRooms)
            {
                var roomDTO = await GetRoomDTOByIdAsync(room.Id);
                if (roomDTO == null)
                {
                    continue;
                }

                if (!string.IsNullOrEmpty(selectedTypeId))
                {
                    if (roomDTO.RoomTypeID != selectedTypeId)
                    {
                        continue;
                    }
                }

                if (roomDTO.Adult < Adult || roomDTO.Children < Children)
                {
                    continue;
                }

                var bookingRoomsInprogress = await _inProgressBookingService.GetInprogressBookingsForRoom(room.Id);
                bool isAvailable = true;

                if (bookingRoomsInprogress != null)
                {
                    foreach (var bookingRoom in bookingRoomsInprogress)
                    {
                        bool isOverlap = !(checkOutDate <= bookingRoom.CheckInDate || checkInDate >= bookingRoom.CheckOutDate);
                        if (isOverlap)
                        {
                            isAvailable = false;
                            break;
                        }
                    }
                }
                if (isAvailable)
                {
                    filterRooms.Add(roomDTO);
                }

            }
            if (filterRooms.Count == 0)
            {
                return null;
            }
            return filterRooms;
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
            var baseUrl = _config["ImagePath"];

            // Tách chuỗi ảnh và thêm đường dẫn phía trước

            var roomDTO = new RoomDTO();
            roomDTO.Id = roomOrigin.Id;
            roomDTO.RoomNumber = roomOrigin.RoomNumber;
            roomDTO.RoomName = roomOrigin.RoomName;
            roomDTO.Description = roomOrigin.Description;
            roomDTO.ImageUrl =
            roomDTO.ImageUrl = roomOrigin.ImageUrl
                .Split(",", StringSplitOptions.RemoveEmptyEntries)
                .Select(fileName => $"{baseUrl}{fileName.Trim()}")
                .ToList();

            roomDTO.Floor = roomOrigin.Floor;
            roomDTO.RoomTypeID = roomOrigin.RoomTypeID.ToString();


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

        public async Task<ApiResponse<RoomDTO>> GetRoomsWithPaginationAsync(int currentPage, int pageSize)
        {
            if (currentPage <= 0 || pageSize <= 0)
            {
                return new ApiResponse<RoomDTO>(null, null, "400", "Current page and page size is require", true, 0, 0, 0, 0, null, null);
            }
            var allRooms = await GetAllRoomAsync();
            int totalItem = allRooms.Count();
            int totalPage = (int)Math.Ceiling((double)totalItem / pageSize);
            var roomsWithPagination = allRooms.Skip((currentPage - 1) * pageSize).Take(pageSize).ToList();
            var roomDTOsWithPagination = new List<RoomDTO>();
            foreach (Room room in roomsWithPagination)
            {
                RoomDTO roomDTO = await GetRoomDTOByIdAsync(room.Id);
                if (roomDTO != null)
                {
                    roomDTOsWithPagination.Add(roomDTO);
                }
            }

            return new ApiResponse<RoomDTO>(roomDTOsWithPagination, null, "200", "Get room successfully", true, currentPage, pageSize, totalPage, totalItem, null, null);
        }

        public async Task<Room?> UpdateRoomAsync(Guid id, RoomRequest roomRequest)
        {
            var roomOrigin = await GetRoomByIdAsync(id);
            if (roomOrigin == null)
            {
                return null;
            }
            int status = 0;
            if (roomRequest.Status.Equals("Available"))
            {
                status = 1;
            }
            string imageUrls = "";
            foreach (var img in roomRequest.ImageUrl)
            {
                var relativPath = await SaveFile(img, "room_images");
                imageUrls += $",{relativPath}";
            }
            roomOrigin.RoomNumber = roomRequest.RoomNumber;
            roomOrigin.RoomName = roomRequest.RoomName;
            roomOrigin.Description = roomRequest.Description;
            roomOrigin.ImageUrl = imageUrls;
            roomOrigin.Floor = roomRequest.Floor;
            roomOrigin.RoomTypeID = Guid.Parse(roomRequest.RoomTypeID);
            roomOrigin.Status = status;
            await _context.SaveChangesAsync();
            return roomOrigin;
        }
    }
}
