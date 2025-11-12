using behotel.DTO;
using behotel.Helper.SendMail;
using behotel.Helper.SendMail.Implement;
using behotel.Helper.Validation;
using behotel.Interface;
using behotel.Interface.Implement;
using behotel.Interfaces;
using behotel.Models;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;


var builder = WebApplication.CreateBuilder(args);



builder.Services.AddValidatorsFromAssemblyContaining<UserRegisterValidator>();
builder.Services.AddFluentValidationClientsideAdapters();
builder.Services.AddFluentValidationAutoValidation();

// Load EmailSettings từ appsettings.json
builder.Services.Configure<EmailSetting>(builder.Configuration.GetSection("EmailSettings"));

// Đăng ký EmailService vào DI container
builder.Services.AddTransient<IMailService, MailImpl>();


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
builder.Services.AddHttpContextAccessor();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new NullableDateTimeConverter());
        options.JsonSerializerOptions.Converters.Add(new NullableDateOnlyConverter());

    });
builder.Services.AddHttpClient();





builder.Services.AddScoped<IUserService, UserImpl>();
builder.Services.AddScoped<IRoomService, RoomImpl>();
builder.Services.AddScoped<IBookingService, behotel.Interface.Implement.BookingImpl>();
builder.Services.AddScoped<ISupportRequestService, SupportRequestImpl>();
builder.Services.AddScoped<IServiceService, ServiceImpl>();
builder.Services.AddScoped<IDiscountService, DiscountService>();
builder.Services.AddScoped<IRoomTypeService, RoomTypeImpl>();
builder.Services.AddScoped<IInProgressBookingService, InprogressBookingImpl>();
builder.Services.AddScoped<IReviewService, ReviewImpl>();
builder.Services.AddScoped<IPaymentService, PaymentImpl>();
builder.Services.AddScoped<IPaymentMethodService, PaymentMethodImpl>();
builder.Services.AddScoped<IPaymentMethodConfigService, PaymentMethodConfigImpl>();
builder.Services.AddScoped<IPaymentWebhookEventService, PaymentWebhookEventImpl>(); 




// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    // 🔐 Cấu hình Swagger để hiển thị nút Authorize (Bearer)
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Nhập JWT token vào đây ( dạng: Bearer {token})",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
                new string[] {}
            }
        });
});

// Add Authentication & JWT
var key = builder.Configuration["Jwt:Key"];
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(option =>
    {
        option.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
        };
    });


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

