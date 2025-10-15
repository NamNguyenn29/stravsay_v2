using Microsoft.EntityFrameworkCore;
namespace behotel.Models
{
    public class HotelManagementContext : DbContext
    {
        public HotelManagementContext(DbContextOptions<HotelManagementContext> options) : base(options) { }

        public DbSet<User> User { get; set; }

    }
}
