namespace behotel.DTO
{
    public class RoomRequest
    {
        public string RoomName { get; set; }
        public int RoomNumber { get; set; }
        public string RoomTypeID { get; set; }
        public int Status { get; set; }
        public string Description { get; set; }
        public List<IFormFile> ImageUrl { get; set; }
        public int Floor { get; set; }
    }
}


