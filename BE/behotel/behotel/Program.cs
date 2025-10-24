using behotel.Controllers;
using behotel.Helper.Validation;
using behotel.Interface;
using behotel.Interface.Implement;
using behotel.Models;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;


var builder = WebApplication.CreateBuilder(args);



builder.Services.AddValidatorsFromAssemblyContaining<UserRegisterValidator>();
builder.Services.AddFluentValidationClientsideAdapters();
builder.Services.AddFluentValidationAutoValidation();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()    // Cho phép tất cả origin (frontend)
            .AllowAnyMethod()    // Cho phép mọi method: GET, POST, PUT, DELETE...
            .AllowAnyHeader();   // Cho phép mọi header
    });
});

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<HotelManagementContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DBConnection")));
builder.Services.AddControllers();




builder.Services.AddScoped<IUserService, UserImpl>();
builder.Services.AddScoped<IRoomService, RoomImpl>();
builder.Services.AddScoped<IBookingService, behotel.Interface.Implement.BookingImpl>();
builder.Services.AddScoped<ISupportRequestService, SupportRequestImpl>();
builder.Services.AddScoped<IServiceService, ServiceImpl>();
builder.Services.AddScoped<IDiscountService, DiscountService>();
builder.Services.AddScoped<IRoomTypeService,RoomTypeImpl>();



// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseCors("AllowAll");

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

