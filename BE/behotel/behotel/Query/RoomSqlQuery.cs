namespace behotel.Query
{
    public static class RoomSqlQuery
    {
        public const string searchRoom = @" Select *
                            From Room 
                            Where RoomName like @Keyword
                            Or Cast(RoomNumber As nvarchar) like @Keyword
                            Or Cast(Floor As nvarchar) like @Keyword
                            ORDER BY CreatedDate DESC";
    }
}
