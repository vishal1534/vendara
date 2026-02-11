using AspNetCoreRateLimit;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace RealServ.Shared.Observability.Extensions;

/// <summary>
/// Extension methods for adding RealServ rate limiting to services.
/// Uses AspNetCoreRateLimit for IP-based and client-based rate limiting.
/// </summary>
public static class RateLimitingExtensions
{
    /// <summary>
    /// Adds RealServ rate limiting with sensible defaults for API services.
    /// Configures both IP-based and client-based rate limiting.
    /// </summary>
    /// <param name="services">The service collection</param>
    /// <param name="configuration">The configuration</param>
    /// <returns>The service collection for chaining</returns>
    /// <remarks>
    /// <para>
    /// Default configuration:
    /// - 100 requests per minute per IP
    /// - 1000 requests per hour per IP
    /// - Configurable via appsettings.json
    /// </para>
    /// <para>
    /// Usage in Program.cs:
    /// <code>
    /// builder.Services.AddRealServRateLimiting(builder.Configuration);
    /// </code>
    /// </para>
    /// <para>
    /// Then in middleware:
    /// <code>
    /// app.UseRealServRateLimiting();
    /// </code>
    /// </para>
    /// </remarks>
    public static IServiceCollection AddRealServRateLimiting(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Needed to store rate limit counters and ip rules
        services.AddMemoryCache();

        // Load configuration from appsettings.json
        services.Configure<IpRateLimitOptions>(configuration.GetSection("IpRateLimiting"));
        services.Configure<IpRateLimitPolicies>(configuration.GetSection("IpRateLimitPolicies"));

        // Inject counter and rules stores
        services.AddInMemoryRateLimiting();

        // Configuration for resolving client IP
        services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();

        return services;
    }

    /// <summary>
    /// Applies RealServ rate limiting middleware to the application pipeline.
    /// Must be called after AddRealServRateLimiting() in Program.cs.
    /// Should be placed early in the middleware pipeline, before authentication.
    /// </summary>
    /// <param name="app">The application builder</param>
    /// <returns>The application builder for chaining</returns>
    /// <remarks>
    /// <para>
    /// Middleware order:
    /// <code>
    /// app.UseRealServRateLimiting();    // ← First (before auth)
    /// app.UseAuthentication();
    /// app.UseAuthorization();
    /// app.MapControllers();
    /// </code>
    /// </para>
    /// </remarks>
    public static IApplicationBuilder UseRealServRateLimiting(this IApplicationBuilder app)
    {
        app.UseIpRateLimiting();
        return app;
    }

    /// <summary>
    /// Generates default rate limiting configuration for RealServ services.
    /// Can be used as a starting point for appsettings.json configuration.
    /// </summary>
    /// <param name="serviceName">The name of the service (for identification)</param>
    /// <param name="profile">The rate limit profile (Standard, Strict, Lenient)</param>
    /// <returns>Configuration object that can be serialized to JSON</returns>
    public static object GetDefaultRateLimitConfig(string serviceName, RateLimitProfile profile = RateLimitProfile.Standard)
    {
        var (perMinute, perHour, perDay) = profile switch
        {
            RateLimitProfile.Strict => (30, 300, 3000),      // Authentication, Payment
            RateLimitProfile.Standard => (100, 1000, 10000), // Most services
            RateLimitProfile.Lenient => (300, 5000, 50000),  // Catalog, read-heavy services
            _ => (100, 1000, 10000)
        };

        return new
        {
            IpRateLimiting = new
            {
                EnableEndpointRateLimiting = true,
                StackBlockedRequests = false,
                RealIpHeader = "X-Real-IP",
                ClientIdHeader = "X-ClientId",
                HttpStatusCode = 429,
                GeneralRules = new[]
                {
                    new
                    {
                        Endpoint = "*",
                        Period = "1m",
                        Limit = perMinute
                    },
                    new
                    {
                        Endpoint = "*",
                        Period = "1h",
                        Limit = perHour
                    },
                    new
                    {
                        Endpoint = "*",
                        Period = "1d",
                        Limit = perDay
                    }
                },
                QuotaExceededResponse = new
                {
                    Content = $"{{\"error\": \"Rate limit exceeded\", \"service\": \"{serviceName}\", \"retryAfter\": \"{{0}}\"}}",
                    ContentType = "application/json",
                    StatusCode = 429
                }
            },
            IpRateLimitPolicies = new
            {
                IpRules = new object[] { }
            }
        };
    }
}

/// <summary>
/// Rate limit profiles for different service types.
/// </summary>
public enum RateLimitProfile
{
    /// <summary>
    /// Strict limits for sensitive operations (auth, payments).
    /// 30/min, 300/hour, 3000/day
    /// </summary>
    Strict,

    /// <summary>
    /// Standard limits for most services.
    /// 100/min, 1000/hour, 10000/day
    /// </summary>
    Standard,

    /// <summary>
    /// Lenient limits for read-heavy services (catalog).
    /// 300/min, 5000/hour, 50000/day
    /// </summary>
    Lenient
}
