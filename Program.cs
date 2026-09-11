using FitnessCenter.Api.Data;
using FitnessCenter.Api.Domain.Entities;
using FitnessCenter.Api.Repositories;
using FitnessCenter.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001", "http://localhost:3005", "http://localhost:3006")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "FitnessCenter API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement {
        {
            new OpenApiSecurityScheme {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseInMemoryDatabase("FitnessCenterDb"));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<ISubscriptionRepository, SubscriptionRepository>();
builder.Services.AddScoped<IWorkoutSessionRepository, WorkoutSessionRepository>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

builder.Services.AddScoped<SubscriptionService>();
builder.Services.AddScoped<BookingService>();
builder.Services.AddScoped<PaymentService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<AdminService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    if (!db.Members.Any())
    {
        db.Members.Add(new Member
        {
            FullName = "Phuraksash",
            Email = "Phuraksash@gmail.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
            Phone = "0999999999",
            Role = "MEMBER"
        });
        db.Members.Add(new Member
        {
            FullName = "Admin Palm",
            Email = "admin@palmfitness.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
            Phone = "0888888888",
            Role = "ADMIN"
        });
        db.SaveChanges();
    }

    if (!db.MembershipPlans.Any())
    {
        db.MembershipPlans.AddRange(
            new MembershipPlan
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                PlanName = "Basic",
                DurationDays = 30,
                Price = 1550m,
                MaxSessionsPerMonth = 8
            },
            new MembershipPlan
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                PlanName = "Standard",
                DurationDays = 30,
                Price = 2490m,
                MaxSessionsPerMonth = 12
            },
            new MembershipPlan
            {
                Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                PlanName = "Premium",
                DurationDays = 30,
                Price = 3990m,
                MaxSessionsPerMonth = 20
            }
        );
        db.SaveChanges();
    }
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();