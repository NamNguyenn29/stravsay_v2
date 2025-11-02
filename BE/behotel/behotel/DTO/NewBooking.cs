namespace behotel.DTO
{
    public class NewBooking
    {
        public string UserId { get; set; }
        public string RoomId { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public string[]? services { get; set; }
        public string? DiscountID { get; set; }
        public int Adult { get; set; }
        public int Children { get; set; }

    }
}
