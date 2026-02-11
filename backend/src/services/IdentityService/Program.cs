using Microsoft.EntityFrameworkCore;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using IdentityService.Data;
using IdentityService.Repositories;
using IdentityService.Services;
using RealServ.Shared.Observability.Extensions;
using RealServ.Shared.Observability.Metrics;
using FluentValidation;
using FluentValidation.AspNetCore;
using AspNetCoreRateLimit;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Add Serilog with CloudWatch
builder.Services.AddSerilogWithCloudWatch(builder.Configuration, "IdentityService");
builder.Host.UseSerilog();

// Add CloudWatch observability (metrics + logging)
builder.Services.AddCloudWatchObservability(builder.Configuration, "IdentityService");

// Add business metrics service
builder.Services.AddScoped<IBusinessMetricsService, BusinessMetricsService>();

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new()
    {
        Title = "RealServ Identity Service API",
        Version = "v1",
        Description = "Identity, authentication and user management service for RealServ platform"
    });
});

// Configure PostgreSQL Database
var connectionString = builder.Configuration.GetConnectionString("IdentityServiceDb");
builder.Services.AddDbContext<IdentityServiceDbContext>(options =>
    options.UseNpgsql(connectionString));

// Configure Firebase Admin SDK
var firebaseCredentialsPath = builder.Configuration["Firebase:CredentialsPath"];
if (!string.IsNullOrEmpty(firebaseCredentialsPath) && File.Exists(firebaseCredentialsPath))
{
    FirebaseApp.Create(new AppOptions()
    {
        Credential = GoogleCredential.FromFile(firebaseCredentialsPath)
    });
}
else
{
    // For development/testing without Firebase
    Console.WriteLine("Warning: Firebase credentials not found. Running without Firebase authentication.");
}

// Register repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IBuyerRepository, BuyerRepository>();
builder.Services.AddScoped<IAddressRepository, AddressRepository>();

// Register services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IBuyerService, BuyerService>();

// FluentValidation - Auto-validate request models
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// RealServ Observability - Adds correlation ID, permission service, etc.
builder.Services.AddRealServObservability();

// Enhanced Health Checks - PostgreSQL + Firebase
builder.Services.AddHealthChecks()
    .AddDbContextCheck<IdentityServiceDbContext>("database");
builder.Services.AddRealServExternalDependencies(builder.Configuration);

// Rate Limiting - Strict profile (30/min, login 5/min)
builder.Services.AddRealServRateLimiting(builder.Configuration);

// CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Auto-migrate database on startup (development only)
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<IdentityServiceDbContext>();
        try
        {
            dbContext.Database.Migrate();
            Console.WriteLine("Database migrations applied successfully.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error applying database migrations: {ex.Message}");
        }
    }
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// RealServ Observability Middleware (correlation ID, request logging)
app.UseRealServObservability();

// Rate Limiting (MUST be before authentication)
app.UseRealServRateLimiting();

// Use CloudWatch observability middleware
app.UseCloudWatchObservability();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

// Enhanced health check endpoints
app.MapRealServHealthChecks();

app.MapGet("/", () => new
{
    service = "RealServ Identity Service",
    version = "1.0.0",
    status = "running",
    timestamp = DateTime.UtcNow
});

app.Run();