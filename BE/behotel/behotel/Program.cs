using behotel.DTO;
using behotel.Helper.SendMail;
using behotel.Helper.SendMail.Implement;
using behotel.Helper.Validation;
using behotel.Interface;
using behotel.Interface.Implement;
using behotel.Models;
using behotel.Services;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
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
    options.AddPolicy("AllowFE", policy =>
    {
        policy
            .WithOrigins("https://localhost:3000", "https://localhost")
            .AllowAnyMethod()    // Cho phép mọi method: GET, POST, PUT, DELETE...
            .AllowAnyHeader()   // Cho phép mọi header
            .AllowCredentials();
    });
});

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<HotelManagementContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DBConnection")));
builder.Services.AddControllers();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new NullableDateTimeConverter());
        //options.JsonSerializerOptions.Converters.Add(new NullableDateOnlyConverter());

    });

builder.Services.AddHttpClient();

builder.Services.AddHttpClient<GeminiService>();
builder.Services.AddScoped<IUserService, UserImpl>();
builder.Services.AddScoped<IRoomService, RoomImpl>();
builder.Services.AddScoped<IBookingService, behotel.Interface.Implement.BookingImpl>();
builder.Services.AddScoped<ISupportRequestService, SupportRequestImpl>();
builder.Services.AddScoped<IServiceService, ServiceImpl>();
builder.Services.AddScoped<IDiscountService, DiscountImpl>();
builder.Services.AddScoped<IRoomTypeService, RoomTypeImpl>();
builder.Services.AddScoped<IInProgressBookingService, InprogressBookingImpl>();
builder.Services.AddScoped<IUserSoftDeleteService,UserSoftDelete>();


builder.Services.AddScoped<IReviewService, ReviewImpl>();
builder.Services.AddScoped<IPaymentService, PaymentImpl>();
builder.Services.AddScoped<IPaymentMethodService, PaymentMethodImpl>();

builder.Services.AddScoped<ISystemLogService, SystemLogImpl>();
builder.Services.AddScoped<ISettingService, SettingImpl>();
builder.Services.AddScoped<IDashboardService, DashboardImpl>();


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
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            ClockSkew = TimeSpan.Zero,


        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var token = context.Request.Cookies["accessToken"];
                if (!string.IsNullOrEmpty(token))
                    context.Token = token;
                return Task.CompletedTask;
            },
            OnAuthenticationFailed = context =>
            {
                if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                {
                    context.Response.StatusCode = 401;
                    context.Response.ContentType = "application/json";
                    return context.Response.WriteAsync("{\"message\":\"Token expired\"}");
                }
                return Task.CompletedTask;
            }
        };

    });



var app = builder.Build();




// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFE");


app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();




app.Run();

