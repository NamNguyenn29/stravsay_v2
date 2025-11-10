namespace behotel.Query
{
    public static class UserSqlQuery
    {
        public const string searchUser = @"SELECT u.*,r.RoleName
                            From [User] u 
                            LEFT JOIN UserRole ur ON u.Id = ur.IdUser
                            LEFT JOIN Role r ON ur.IdRole = r.Id
                            Where u.FullName like @Keyword
                            OR u.Email LIKE @Keyword
                            OR u.Phone LIKE @Keyword
                            OR r.RoleName LIKE @Keyword
                            ORDER BY u.CreatedDate DESC";
    }
}
