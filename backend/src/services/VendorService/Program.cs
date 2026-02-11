using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using VendorService.Data;
using VendorService.Middleware;
using VendorService.Models.Authorization;
using VendorService.Models.Configuration;
using VendorService.Repositories;
using VendorService.Services;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// ========================================
// CONFIGURATION
// ========================================

builder.Services.Configure<PaginationSettings>(builder.Configuration.GetSection("Pagination"));
builder.Services.Configure<RateLimitingSettings>(builder.Configuration.GetSection("RateLimiting"));
builder.Services.Configure<CachingSettings>(builder.Configuration.GetSection("Caching"));

// ========================================
// DATABASE
// ========================================

builder.Services.AddDbContext<VendorDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("VendorServiceDb")));

// ========================================
// REDIS CACHING
// ========================================

var redisConnection = builder.Configuration.GetConnectionString("Redis");
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = redisConnection;
    options.InstanceName = "VendorService:";
});

builder.Services.AddSingleton<ICachingService, RedisCachingService>();

// ========================================
// REPOSITORIES
// ========================================

builder.Services.AddScoped<IVendorRepository, VendorRepository>();
builder.Services.AddScoped<IVendorInventoryRepository, VendorInventoryRepository>();
builder.Services.AddScoped<IVendorLaborRepository, VendorLaborRepository>();
builder.Services.AddScoped<IVendorDocumentRepository, VendorDocumentRepository>();
builder.Services.AddScoped<IVendorRatingRepository, VendorRatingRepository>();
builder.Services.AddScoped<IVendorServiceAreaRepository, VendorServiceAreaRepository>();
builder.Services.AddScoped<IVendorBusinessHourRepository, VendorBusinessHourRepository>();
builder.Services.AddScoped<IVendorBankAccountRepository, VendorBankAccountRepository>();

// ========================================
// CORS
// ========================================

var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() 
    ?? new[] { "http://localhost:3000" };

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// ========================================
// RATE LIMITING
// ========================================

var rateLimitSettings = builder.Configuration.GetSection("RateLimiting").Get<RateLimitingSettings>() 
    ?? new RateLimitingSettings();

builder.Services.AddRateLimiter(options =>
{
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
    {
        var ipAddress = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        
        return RateLimitPartition.GetFixedWindowLimiter(ipAddress, _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = rateLimitSettings.PermitLimit,
            Window = TimeSpan.FromSeconds(rateLimitSettings.Window),
            QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
            QueueLimit = rateLimitSettings.QueueLimit
        });
    });

    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});

// ========================================
// FIREBASE AUTHENTICATION
// ========================================

var firebaseProjectId = builder.Configuration["Firebase:ProjectId"];

if (!string.IsNullOrEmpty(firebaseProjectId))
{
    try
    {
        if (FirebaseApp.DefaultInstance == null)
        {
            FirebaseApp.Create(new AppOptions
            {
                Credential = GoogleCredential.GetApplicationDefault(),
                ProjectId = firebaseProjectId
            });
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Firebase initialization warning: {ex.Message}");
    }
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = $"https://securetoken.google.com/{firebaseProjectId}";
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = $"https://securetoken.google.com/{firebaseProjectId}",
            ValidateAudience = true,
            ValidAudience = firebaseProjectId,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true
        };
    });

// ========================================
// AUTHORIZATION POLICIES
// ========================================

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(AuthorizationPolicies.AdminOnly, policy =>
        policy.RequireRole(UserRoles.Admin));

    options.AddPolicy(AuthorizationPolicies.VendorOnly, policy =>
        policy.RequireRole(UserRoles.Vendor));

    options.AddPolicy(AuthorizationPolicies.CustomerOnly, policy =>
        policy.RequireRole(UserRoles.Customer));

    options.AddPolicy(AuthorizationPolicies.VendorOrAdmin, policy =>
        policy.RequireRole(UserRoles.Vendor, UserRoles.Admin));

    options.AddPolicy(AuthorizationPolicies.CustomerOrAdmin, policy =>
        policy.RequireRole(UserRoles.Customer, UserRoles.Admin));

    options.AddPolicy(AuthorizationPolicies.AnyAuthenticated, policy =>
        policy.RequireAuthenticatedUser());
});

// ========================================
// GLOBAL EXCEPTION HANDLING
// ========================================

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// ========================================
// CONTROLLERS & SWAGGER
// ========================================

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { 
        Title = "RealServ Vendor Service API", 
        Version = "v1",
        Description = "Vendor management, inventory, and ratings API"
    });
    
    // JWT Bearer authentication
    c.AddSecurityDefinition("Bearer", new()
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter your Firebase JWT token"
    });
    
    c.AddSecurityRequirement(new()
    {
        {
            new()
            {
                Reference = new()
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddHealthChecks()
    .AddNpgSql(builder.Configuration.GetConnectionString("VendorServiceDb")!)
    .AddRedis(redisConnection!);

// ========================================
// BUILD APP
// ========================================

var app = builder.Build();

// ========================================
// MIDDLEWARE PIPELINE
// ========================================

// Global exception handler
app.UseExceptionHandler();

// Swagger (all environments)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Vendor Service API v1");
    c.RoutePrefix = string.Empty; // Swagger at root
});

// Security headers
app.Use(async (context, next) =>
{
    context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Add("X-Frame-Options", "DENY");
    context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
    context.Response.Headers.Add("Referrer-Policy", "strict-origin-when-cross-origin");
    await next();
});

// HTTPS redirection (production)
if (app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
    app.UseHsts();
}

// CORS
app.UseCors();

// Rate limiting
app.UseRateLimiter();

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// Controllers
app.MapControllers();

// Health checks
app.MapHealthChecks("/health");

// ========================================
// DATABASE MIGRATION (Development only)
// ========================================

if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<VendorDbContext>();
    
    try
    {
        await dbContext.Database.MigrateAsync();
        Console.WriteLine("✅ Database migration completed successfully");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"⚠️ Database migration skipped: {ex.Message}");
    }
}

// ========================================
// RUN APPLICATION
// ========================================

Console.WriteLine("🚀 Vendor Service starting...");
Console.WriteLine($"🌍 Environment: {app.Environment.EnvironmentName}");
Console.WriteLine($"🔐 Security: CORS ✓ | Rate Limiting ✓ | Auth ✓ | Caching ✓");
Console.WriteLine($"📊 Database: PostgreSQL");
Console.WriteLine($"💾 Cache: Redis");

app.Run();