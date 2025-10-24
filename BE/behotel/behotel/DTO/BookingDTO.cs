using behotel.Models;

namespace behotel.DTO
{
    public class BookingDTO
    {
        public Guid Id { get; set; }

        public string FullName { get; set; }
        public string Phone { get; set; }
        public int RoomNumber { get; set; }
        public string RoomName { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public decimal Price { get; set; }
        public string? discountCode { get; set; }
        public int Status { get; set; }
        public DateTime CreatedDate { get; set; }
        public List<String>? Services { get; set; }
    }
}
