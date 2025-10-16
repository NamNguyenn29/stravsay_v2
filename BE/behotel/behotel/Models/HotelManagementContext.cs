using Microsoft.EntityFrameworkCore;
namespace behotel.Models
{
    public class HotelManagementContext : DbContext
    {
        public HotelManagementContext(DbContextOptions<HotelManagementContext> options) : base(options) { }

        public DbSet<User> User { get; set; }
        public DbSet<UserRole> userRoles { get; set; }
        public DbSet<Service> Service { get; set; }
        public DbSet<RoomType> RoomTypes { get; set; }
        public DbSet<Room> Room { get; set; }
        public DbSet<Role> Role { get; set; }
        public DbSet<Discount> Discount { get; set; }
        public DbSet<BookingService> bookingServices { get; set; }
        public DbSet<Booking> Booking { get; set; }


    }
}
