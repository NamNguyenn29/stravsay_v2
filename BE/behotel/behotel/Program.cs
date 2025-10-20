using Microsoft.EntityFrameworkCore;
using behotel.Models;
using behotel.Interface;
using behotel.Interface.Implement;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<HotelManagementContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DBConnection")));
builder.Services.AddControllers();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IRoomService, RoomService>();
builder.Services.AddScoped<IBookingService, behotel.Interface.Implement.BookingService>();
builder.Services.AddScoped<ISupportRequestService, SupportRequestService>();
builder.Services.AddScoped<IServiceService, ServiceService>();
builder.Services.AddScoped<IDiscountService, DiscountService>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();


app.Run();

