namespace behotel.DTO
{
    public class RoomDTO
    {
        public Guid Id { get; set; }
        public string RoomName { get; set; }
        public int RoomNumber { get; set; }
        public string Description { get; set; }
        public string[] ImageUrl { get; set; }
        public int Floor { get; set; }
        public int Status { get; set; }
        public DateTime CreatedDate { get; set; }
        public string TypeName { get; set; }
        public decimal BasePrice { get; set; }
        public bool HasBreakFast { get; set; }
        public string BedType { get; set; }
        public int Children { get; set; }
        public int Adult { get; set; }
        public int Space { get; set; }
    }
}
