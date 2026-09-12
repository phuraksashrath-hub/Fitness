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
        var origins = new List<string>
        {
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:3005",
            "http://localhost:3006"
        };

        var configuredOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
        var frontendUrl = builder.Configuration["Cors:FrontendUrl"];

        if (!string.IsNullOrWhiteSpace(frontendUrl))
        {
            origins.Add(frontendUrl);
        }

        foreach (var origin in configuredOrigins)
        {
            if (!string.IsNullOrWhiteSpace(origin) && !origins.Contains(origin))
            {
                origins.Add(origin);
            }
        }

        policy.WithOrigins(origins.ToArray())
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

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ??
    "Data Source=fitnesscenter.db";

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite(connectionString));

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
    db.Database.EnsureCreated();

    if (!db.Members.Any())
    {
        var admin = new Member
        {
            FullName = "Admin Palm",
            Email = "admin@palmfitness.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
            Phone = "0888888888",
            Role = "ADMIN"
        };

        var demoMember = new Member
        {
            FullName = "Siriwan Wongsiri",
            Email = "member@palmfitness.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("member123"),
            Phone = "0812345678",
            Role = "MEMBER"
        };

        db.Members.AddRange(admin, demoMember);
        db.SaveChanges();
    }

    if (!db.Trainers.Any())
    {
        db.Trainers.AddRange(
            new Trainer
            {
                Id = Guid.Parse("44444444-4444-4444-4444-444444444441"),
                FullName = "Coach Palm",
                Email = "coach.palm@palmfitness.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("trainer123"),
                Role = "TRAINER",
                Specialty = "Strength & Conditioning"
            },
            new Trainer
            {
                Id = Guid.Parse("44444444-4444-4444-4444-444444444442"),
                FullName = "Coach Mint",
                Email = "coach.mint@palmfitness.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("trainer123"),
                Role = "TRAINER",
                Specialty = "Mobility & Recovery"
            },
            new Trainer
            {
                Id = Guid.Parse("44444444-4444-4444-4444-444444444443"),
                FullName = "Coach Natt",
                Email = "coach.natt@palmfitness.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("trainer123"),
                Role = "TRAINER",
                Specialty = "HIIT & Fat Burn"
            });
        db.SaveChanges();
    }

    if (!db.MembershipPlans.Any())
    {
        var plans = new[]
        {
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
        };

        db.MembershipPlans.AddRange(plans);
        db.SaveChanges();
    }

    var existingAdmin = await db.Members.FirstOrDefaultAsync(x => x.Email == "admin@palmfitness.com");
    if (existingAdmin is not null && !db.Subscriptions.Any())
    {
        var demo = await db.Members.FirstOrDefaultAsync(x => x.Email == "member@palmfitness.com");
        var plans = await db.MembershipPlans.ToListAsync();
        var plan = plans.OrderBy(x => x.Price).FirstOrDefault();

        if (demo is not null && plan is not null)
        {
            db.Subscriptions.Add(new Subscription
            {
                MemberId = demo.Id,
                PlanId = plan.Id,
                StartDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-20)),
                EndDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(10)),
                Status = "ACTIVE",
                RemainingSessions = plan.MaxSessionsPerMonth
            });
            db.SaveChanges();
        }
    }
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();