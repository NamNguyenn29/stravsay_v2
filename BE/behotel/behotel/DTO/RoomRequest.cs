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


//ê tôi đang muốn nâng cấp phần mềm của mình 1 tí, lúc trước tôi lưu image của room thành 1 mảng các string ở back end và 1 string dài mỗi image cách nhau 1 dấu phẩy giừo tôi muốn dùng wwwroot để lưu hình ảnh mà 