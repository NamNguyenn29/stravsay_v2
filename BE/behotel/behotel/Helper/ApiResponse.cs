namespace behotel.Helper
{
    public class ApiResponse<T>
    {
        public int? TotalPage { get; set; }
        public int? currentPage { get; set; }
        public List<T>? List { get; set; }
        public T? Object { get; set; }
        public string? Code { get; set; }
        public string? Message { get; set; }
        public bool? IsSuccess { get; set; }
        public string? String { get; set; }
        public int? Int { get; set; }
    }


    
}




