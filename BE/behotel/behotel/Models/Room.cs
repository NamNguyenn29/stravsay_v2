namespace behotel.Models
{
    public class Room
    {
        public Guid Id { get; set; }
        public string  RoomName { get; set; }
        public int RoomNumber { get; set; }
        public bool IsAvailable { get; set; }
        public Guid RoomTypeID { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public int Floor { get; set; }
        public int Status { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
