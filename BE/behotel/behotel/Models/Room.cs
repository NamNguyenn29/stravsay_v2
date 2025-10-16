namespace behotel.Models
{
    public class Room
    {
        public Guid Id { get; set; }
        public int RoomName { get; set; }
        public string RoomNumber { get; set; }
        public bool Isvailable { get; set; }
        public Guid RoomTypeID { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public string Floor { get; set; }
        public int Status { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
