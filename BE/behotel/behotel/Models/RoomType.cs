namespace behotel.Models
{
    public class RoomType
    {
        public Guid Id { get; set; }
        public string TypeName { get; set; }
        public string BasePrice { get; set; }
        public int Capacity { get; set; }
        public bool HasBreakFast { get; set; }
        public string BedType { get; set; }
        public int Status { get; set; }
        public DateTime CreatedDate { get; set; }
        public int Children {  get; set; }
        public int Adult {  get; set; }
        public int space { get; set; }
    }
}
