using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using RealServ.Shared.Observability.Authorization;
using RealServ.Shared.Observability.Middleware;

namespace RealServ.Shared.Observability.Extensions;

/// <summary>
/// Extension methods for adding RealServ observability and security middleware to the application pipeline.
/// </summary>
public static class ObservabilityExtensions
{
    /// <summary>
    /// Adds all RealServ observability services to the service collection.
    /// Includes permission service, logging, metrics, etc.
    /// </summary>
    /// <param name="services">The service collection</param>
    /// <returns>The service collection for chaining</returns>
    public static IServiceCollection AddRealServObservability(this IServiceCollection services)
    {
        // Add HTTP client for PermissionService
        services.AddHttpClient<IPermissionService, HttpPermissionService>();

        // Add memory cache for permission caching
        services.AddMemoryCache();
        
        // Add HttpClient for health checks
        services.AddHttpClient();

        return services;
    }

    /// <summary>
    /// Adds all RealServ middleware to the application pipeline in the correct order.
    /// This is the recommended way to add all middleware for consistency.
    /// </summary>
    /// <param name="app">The application builder</param>
    /// <param name="useInternalApiAuth">Whether to enable internal API authentication (default: false)</param>
    /// <returns>The application builder for chaining</returns>
    /// <remarks>
    /// <para>
    /// Middleware order:
    /// 1. CorrelationIdMiddleware - Assigns correlation IDs to all requests
    /// 2. InternalApiAuthenticationMiddleware - (Optional) Authenticates service-to-service calls
    /// 3. RequestLoggingMiddleware - Logs all requests with timing
    /// 4. ExceptionLoggingMiddleware - Catches and logs unhandled exceptions
    /// </para>
    /// <para>
    /// Usage in Program.cs:
    /// <code>
    /// app.UseRealServObservability(useInternalApiAuth: false);
    /// 
    /// // OR enable internal API auth for specific paths:
    /// app.UseRealServObservability();
    /// app.UseWhen(
    ///     context => context.Request.Path.StartsWithSegments("/internal"),
    ///     appBuilder => appBuilder.UseMiddleware&lt;InternalApiAuthenticationMiddleware&gt;()
    /// );
    /// </code>
    /// </para>
    /// </remarks>
    public static IApplicationBuilder UseRealServObservability(
        this IApplicationBuilder app,
        bool useInternalApiAuth = false)
    {
        // 1. Correlation ID - Must be first to ensure all logs have correlation ID
        app.UseMiddleware<CorrelationIdMiddleware>();

        // 2. Internal API Authentication (optional, for service-to-service endpoints)
        if (useInternalApiAuth)
        {
            app.UseMiddleware<InternalApiAuthenticationMiddleware>();
        }

        // 3. Request Logging - Log all requests with timing and metrics
        app.UseMiddleware<RequestLoggingMiddleware>();

        // 4. Exception Logging - Must be last to catch all exceptions
        app.UseMiddleware<ExceptionLoggingMiddleware>();

        return app;
    }

    /// <summary>
    /// Adds internal API authentication middleware for specific routes only.
    /// Use this to protect internal endpoints while leaving public endpoints open.
    /// </summary>
    /// <param name="app">The application builder</param>
    /// <param name="pathPrefix">The path prefix to protect (e.g., "/internal")</param>
    /// <returns>The application builder for chaining</returns>
    /// <example>
    /// <code>
    /// app.UseInternalApiAuth("/internal");
    /// // Now /internal/* routes require X-Internal-API-Key header
    /// </code>
    /// </example>
    public static IApplicationBuilder UseInternalApiAuth(
        this IApplicationBuilder app,
        string pathPrefix = "/internal")
    {
        app.UseWhen(
            context => context.Request.Path.StartsWithSegments(pathPrefix),
            appBuilder => appBuilder.UseMiddleware<InternalApiAuthenticationMiddleware>()
        );

        return app;
    }
}