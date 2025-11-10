namespace behotel.Query
{
    public static class SupportRequestSqlQuery
    {
        public const string SupportRequestSearch = @"
                            SELECT *
                            FROM SupportRequest
                            WHERE (
                                   UserEmail LIKE @Keyword
                                   OR Title LIKE @Keyword)
                            ORDER BY CreatedDate DESC";


    }
}
