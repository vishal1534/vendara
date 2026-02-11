using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using FluentValidation;
using FluentValidation.AspNetCore;
using AspNetCoreRateLimit;
using Serilog;
using Polly;
using Polly.Extensions.Http;
using IntegrationService.Data;
using IntegrationService.Services;
using IntegrationService.Services.Interfaces;
using IntegrationService.Repositories;
using IntegrationService.Repositories.Interfaces;
using IntegrationService.Models.Configuration;

var builder = WebApplication.CreateBuilder(args);

// ============================================================================
// LOGGING CONFIGURATION
// ============================================================================
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .Enrich.WithProperty("Service", "IntegrationService")
    .WriteTo.Console()
    .WriteTo.File("logs/integration-service-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// ============================================================================
// CONFIGURATION
// ============================================================================
var configuration = builder.Configuration;
var connectionString = configuration.GetConnectionString("DefaultConnection");
var redisConnection = configuration.GetConnectionString("Redis");

// ============================================================================
// CONFIGURATION VALIDATION - Options Pattern with Validation
// ============================================================================
builder.Services.AddOptions<WhatsAppSettings>()
    .Bind(configuration.GetSection(WhatsAppSettings.SectionName))
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services.AddOptions<AwsSettings>()
    .Bind(configuration.GetSection(AwsSettings.SectionName))
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services.AddOptions<GoogleMapsSettings>()
    .Bind(configuration.GetSection(GoogleMapsSettings.SectionName))
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services.AddOptions<FileUploadSettings>()
    .Bind(configuration.GetSection(FileUploadSettings.SectionName))
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services.AddOptions<LocationCacheSettings>()
    .Bind(configuration.GetSection(LocationCacheSettings.SectionName))
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services.AddOptions<RetryPolicySettings>()
    .Bind(configuration.GetSection(RetryPolicySettings.SectionName))
    .ValidateDataAnnotations()
    .ValidateOnStart();

builder.Services.AddOptions<CircuitBreakerSettings>()
    .Bind(configuration.GetSection(CircuitBreakerSettings.SectionName))
    .ValidateDataAnnotations()
    .ValidateOnStart();

// ============================================================================
// DEPENDENCY INJECTION - SERVICES
// ============================================================================
builder.Services.AddScoped<IWhatsAppService, WhatsAppService>();
builder.Services.AddScoped<IMediaUploadService, MediaUploadService>();
builder.Services.AddScoped<IGoogleMapsService, GoogleMapsService>();
builder.Services.AddSingleton<IWebhookSignatureValidator, WebhookSignatureValidator>();
builder.Services.AddScoped<IAuditService, AuditService>();

// ============================================================================
// BACKGROUND SERVICES
// ============================================================================
builder.Services.AddHostedService<LocationCacheCleanupService>();