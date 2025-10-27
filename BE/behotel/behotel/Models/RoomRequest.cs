namespace behotel.Models
{
    public class RoomRequest
    {
        public string RoomName { get; set; }
        public int RoomNumber { get; set; }
        public string RoomTypeID { get; set; }
        public string Status { get; set; }
        public string Description { get; set; }
        public string[] ImageUrl { get; set; }
        public int Floor { get; set; }
    }
}
