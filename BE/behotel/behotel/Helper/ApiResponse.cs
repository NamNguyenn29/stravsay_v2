namespace behotel.Helper
{
    public class ApiResponse<T>
    {
        public int? TotalPage { get; set; }
        public int? currentPage { get; set; }
        public List<T>? List { get; set; }
        public T? Object { get; set; }
        public string Code { get; set; }
        public string Message { get; set; }
        public bool IsSuccess { get; set; }
        public string? String { get; set; }
        public int? Int { get; set; }



        public ApiResponse(int TotalPage, int CurrentPage, List<T> List, T Object, string Code, string Message, bool IsSuccess, string String, int Int)
        {
               this.TotalPage = TotalPage;
            this.currentPage = CurrentPage;
            this.List = List;
            this.Object = Object;
            this.Code = Code;
            this.Message = Message;
            this.IsSuccess = IsSuccess;
            this.String = String;
            this.Int = Int;
        }

        public ApiResponse() { }
    }



    
}




