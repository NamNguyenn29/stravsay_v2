﻿using Microsoft.EntityFrameworkCore;
namespace behotel.Models
{
    public class HotelManagementContext : DbContext
    {
        public HotelManagementContext(DbContextOptions<HotelManagementContext> options) : base(options) { }

        public DbSet<User> User { get; set; }
        public DbSet<UserRole> UserRole { get; set; }
        public DbSet<Service> Service { get; set; }
        public DbSet<RoomType> RoomType { get; set; }
        public DbSet<Room> Room { get; set; }
        public DbSet<Role> Role { get; set; }
        public DbSet<Discount> Discount { get; set; }
        public DbSet<BookingService> BookingService { get; set; }
        public DbSet<Booking> Booking { get; set; }

        public DbSet<SupportRequest> SupportRequest { get; set; }

        public DbSet<User_Deleted> User_Deleted { get; set; }


    }
}
