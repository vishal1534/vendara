using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
using OrderService.Data;
using OrderService.Data.Seeds;
using OrderService.Repositories;
using OrderService.Services;
using OrderService.Middleware;
using OrderService.Models.Configuration;
using OrderService.Models.Authorization;
using RealServ.Shared.Observability.Extensions;
using RealServ.Shared.Observability.Metrics;
using RealServ.Shared.Infrastructure.Middleware;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Add Serilog with CloudWatch
builder.Services.AddSerilogWithCloudWatch(builder.Configuration, "OrderService");
builder.Host.UseSerilog();

// Add CloudWatch observability (metrics + logging)
builder.Services.AddCloudWatchObservability(builder.Configuration, "OrderService");

// Add business metrics service
builder.Services.AddScoped<IBusinessMetricsService, BusinessMetricsService>();

// Configure settings
builder.Services.Configure<PaginationSettings>(
    builder.Configuration.GetSection("Pagination"));
builder.Services.Configure<RateLimitingSettings>(
    builder.Configuration.GetSection("RateLimiting"));
builder.Services.Configure<CachingSettings>(
    builder.Configuration.GetSection("Caching"));

// Add controllers
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configure Swagger
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new()
    {
        Title = "RealServ Order Service API",
        Version = "v1",
        Description = "Order management and fulfillment service for RealServ platform"
    });
    
    // Add JWT authentication to Swagger
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer"
    });
    
    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Configure PostgreSQL Database with optimized settings
var connectionString = builder.Configuration.GetConnectionString("OrderServiceDb");
builder.Services.AddDbContext<OrderServiceDbContext>(options =>
{
    options.UseNpgsql(connectionString, npgsqlOptions =>
    {
        npgsqlOptions.MinBatchSize(1);
        npgsqlOptions.MaxBatchSize(100);
        npgsqlOptions.EnableRetryOnFailure(
            maxRetryCount: 3,
            maxRetryDelay: TimeSpan.FromSeconds(5),
            errorCodesToAdd: null);
        npgsqlOptions.CommandTimeout(30);
    });
});

// Configure Redis Cache
var redisConnection = builder.Configuration.GetConnectionString("Redis");
if (!string.IsNullOrEmpty(redisConnection))
{
    builder.Services.AddStackExchangeRedisCache(options =>
    {
        options.Configuration = redisConnection;
        options.InstanceName = "OrderService_";
    });
}
else
{
    // Fallback to in-memory cache for development
    builder.Services.AddDistributedMemoryCache();
}

// Register caching service
builder.Services.AddScoped<ICachingService, RedisCachingService>();

// Register repositories
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IDeliveryAddressRepository, DeliveryAddressRepository>();
builder.Services.AddScoped<IOrderStatusHistoryRepository, OrderStatusHistoryRepository>();
builder.Services.AddScoped<IDisputeRepository, DisputeRepository>();
builder.Services.AddScoped<IOrderIssueRepository, OrderIssueRepository>();

// Register Firebase authentication filter
builder.Services.AddScoped<FirebaseAuthenticationFilter>();

// Add HTTP clients for service communication
builder.Services.AddHttpClient("IdentityService", client =>
{
    var baseUrl = builder.Configuration["ServiceUrls:IdentityService"];
    if (!string.IsNullOrEmpty(baseUrl))
        client.BaseAddress = new Uri(baseUrl);
});

builder.Services.AddHttpClient("CatalogService", client =>
{
    var baseUrl = builder.Configuration["ServiceUrls:CatalogService"];
    if (!string.IsNullOrEmpty(baseUrl))
        client.BaseAddress = new Uri(baseUrl);
});

builder.Services.AddHttpClient("VendorService", client =>
{
    var baseUrl = builder.Configuration["ServiceUrls:VendorService"];
    if (!string.IsNullOrEmpty(baseUrl))
        client.BaseAddress = new Uri(baseUrl);
});

// Configure CORS with restricted origins
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() 
    ?? new[] { "http://localhost:3000" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Configure Rate Limiting
var rateLimitSettings = builder.Configuration.GetSection("RateLimiting").Get<RateLimitingSettings>() 
    ?? new RateLimitingSettings();

builder.Services.AddRateLimiter(options =>
{
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
    {
        var ipAddress = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        
        return RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: ipAddress,
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = rateLimitSettings.PermitLimit,
                Window = TimeSpan.FromSeconds(rateLimitSettings.Window),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = rateLimitSettings.QueueLimit
            });
    });
    
    options.OnRejected = async (context, cancellationToken) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        await context.HttpContext.Response.WriteAsJsonAsync(new
        {
            success = false,
            message = "Too many requests. Please try again later.",
            retryAfter = context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter) 
                ? retryAfter.TotalSeconds 
                : rateLimitSettings.Window
        }, cancellationToken);
    };
});

// Configure Authorization Policies
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
    
    options.AddPolicy(AuthorizationPolicies.CustomerOrVendor, policy =>
        policy.RequireRole(UserRoles.Customer, UserRoles.Vendor));
    
    options.AddPolicy(AuthorizationPolicies.AnyAuthenticated, policy =>
        policy.RequireAuthenticatedUser());
});

// Add global exception handling
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// Add health checks
builder.Services.AddHealthChecks()
    .AddDbContextCheck<OrderServiceDbContext>("database");

var app = builder.Build();

// Auto-migrate database on startup (development only)
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<OrderServiceDbContext>();
        try
        {
            dbContext.Database.Migrate();
            Console.WriteLine("✅ Database migrations applied successfully.");
            
            // Seed database
            await DatabaseSeeder.SeedAsync(dbContext);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Error applying database migrations: {ex.Message}");
        }
    }
}

// Configure the HTTP request pipeline
app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Use rate limiting (must be before CORS and auth)
app.UseRateLimiter();

// Use CORS with restricted origins
app.UseCors("AllowSpecificOrigins");

// Use API versioning middleware
app.UseApiVersioning();

// Use CloudWatch observability middleware
app.UseCloudWatchObservability();

// Authentication and Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapHealthChecks("/health");

app.Run();
