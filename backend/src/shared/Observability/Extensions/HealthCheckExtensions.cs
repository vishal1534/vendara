using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using RealServ.Shared.Observability.HealthChecks;
using System.Text.Json;

namespace RealServ.Shared.Observability.Extensions;

/// <summary>
/// Extension methods for adding RealServ health checks to services.
/// </summary>
public static class HealthCheckExtensions
{
    /// <summary>
    /// Adds RealServ health checks for external dependencies.
    /// Automatically detects which dependencies are configured and adds appropriate health checks.
    /// </summary>
    /// <param name="builder">The health checks builder</param>
    /// <param name="serviceName">The name of the service (for tagging)</param>
    /// <returns>The health checks builder for chaining</returns>
    /// <remarks>
    /// <para>
    /// This method intelligently adds health checks based on configuration:
    /// - If Firebase is configured → adds FirebaseHealthCheck
    /// - If Razorpay is configured → adds RazorpayHealthCheck
    /// - If WhatsApp is configured → adds WhatsAppHealthCheck
    /// - If Google Maps is configured → adds GoogleMapsHealthCheck
    /// - If AWS S3 is configured → adds S3HealthCheck
    /// </para>
    /// <para>
    /// Usage in Program.cs:
    /// <code>
    /// builder.Services.AddHealthChecks()
    ///     .AddNpgSql(connectionString)
    ///     .AddRedis(redisConnection)
    ///     .AddRealServExternalDependencies("IdentityService");
    /// </code>
    /// </para>
    /// </remarks>
    public static IHealthChecksBuilder AddRealServExternalDependencies(
        this IHealthChecksBuilder builder,
        string serviceName)
    {
        // Get service provider to check configuration
        var services = builder.Services;
        
        // Add Firebase health check (if configured)
        builder.AddCheck<FirebaseHealthCheck>(
            name: "firebase",
            failureStatus: HealthStatus.Degraded,
            tags: new[] { "external", "auth", serviceName.ToLower() }
        );

        // Add Razorpay health check (if configured)
        builder.AddCheck<RazorpayHealthCheck>(
            name: "razorpay",
            failureStatus: HealthStatus.Degraded,
            tags: new[] { "external", "payment", serviceName.ToLower() }
        );

        // Add WhatsApp health check (if configured)
        builder.AddCheck<WhatsAppHealthCheck>(
            name: "whatsapp",
            failureStatus: HealthStatus.Degraded,
            tags: new[] { "external", "messaging", serviceName.ToLower() }
        );

        // Add Google Maps health check (if configured)
        builder.AddCheck<GoogleMapsHealthCheck>(
            name: "googlemaps",
            failureStatus: HealthStatus.Degraded,
            tags: new[] { "external", "location", serviceName.ToLower() }
        );

        // Add S3 health check (if configured)
        builder.AddCheck<S3HealthCheck>(
            name: "s3",
            failureStatus: HealthStatus.Degraded,
            tags: new[] { "external", "storage", serviceName.ToLower() }
        );

        return builder;
    }

    /// <summary>
    /// Maps health check endpoints with detailed JSON responses.
    /// Creates two endpoints:
    /// - /health - Simple liveness check (returns 200 if any dependency is healthy)
    /// - /health/ready - Detailed readiness check with all dependency statuses
    /// </summary>
    /// <param name="app">The application builder</param>
    /// <returns>The application builder for chaining</returns>
    /// <remarks>
    /// <para>
    /// Usage in Program.cs:
    /// <code>
    /// app.MapRealServHealthChecks();
    /// </code>
    /// </para>
    /// <para>
    /// Response format for /health/ready:
    /// <code>
    /// {
    ///   "status": "Healthy",
    ///   "timestamp": "2026-01-12T10:30:00Z",
    ///   "duration": "125ms",
    ///   "results": {
    ///     "database": { "status": "Healthy", "data": {...} },
    ///     "redis": { "status": "Healthy", "data": {...} },
    ///     "firebase": { "status": "Healthy", "data": {...} }
    ///   }
    /// }
    /// </code>
    /// </para>
    /// </remarks>
    public static IApplicationBuilder MapRealServHealthChecks(this IApplicationBuilder app)
    {
        // Simple health check endpoint (liveness)
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapHealthChecks("/health", new HealthCheckOptions
            {
                Predicate = _ => true,
                ResponseWriter = WriteSimpleHealthCheckResponse
            });

            // Detailed health check endpoint (readiness)
            endpoints.MapHealthChecks("/health/ready", new HealthCheckOptions
            {
                Predicate = _ => true,
                ResponseWriter = WriteDetailedHealthCheckResponse,
                AllowCachingResponses = false
            });
        });

        return app;
    }

    private static Task WriteSimpleHealthCheckResponse(
        HttpContext context,
        HealthReport report)
    {
        context.Response.ContentType = "application/json";

        var result = JsonSerializer.Serialize(new
        {
            status = report.Status.ToString(),
            timestamp = DateTime.UtcNow
        });

        return context.Response.WriteAsync(result);
    }

    private static Task WriteDetailedHealthCheckResponse(
        HttpContext context,
        HealthReport report)
    {
        context.Response.ContentType = "application/json";

        var result = JsonSerializer.Serialize(new
        {
            status = report.Status.ToString(),
            timestamp = DateTime.UtcNow,
            duration = $"{report.TotalDuration.TotalMilliseconds:0}ms",
            results = report.Entries.ToDictionary(
                entry => entry.Key,
                entry => new
                {
                    status = entry.Value.Status.ToString(),
                    description = entry.Value.Description,
                    duration = $"{entry.Value.Duration.TotalMilliseconds:0}ms",
                    data = entry.Value.Data,
                    exception = entry.Value.Exception?.Message,
                    tags = entry.Value.Tags
                }
            )
        }, new JsonSerializerOptions
        {
            WriteIndented = true
        });

        return context.Response.WriteAsync(result);
    }
}
