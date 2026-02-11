using Microsoft.AspNetCore.Http;

namespace CatalogService.Middleware;

/// <summary>
/// Middleware to add API versioning headers to responses
/// Provides version information for API clients
/// </summary>
public class ApiVersioningMiddleware
{
    private readonly RequestDelegate _next;
    private const string ApiVersion = "1.0";
    private const string ServiceName = "RealServ Catalog Service";

    public ApiVersioningMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Add versioning headers to all responses
        context.Response.OnStarting(() =>
        {
            // API version header
            if (!context.Response.Headers.ContainsKey("X-API-Version"))
            {
                context.Response.Headers.Add("X-API-Version", ApiVersion);
            }

            // Service name header
            if (!context.Response.Headers.ContainsKey("X-Service-Name"))
            {
                context.Response.Headers.Add("X-Service-Name", ServiceName);
            }

            // Response time header
            if (context.Items.ContainsKey("RequestStartTime"))
            {
                var startTime = (DateTime)context.Items["RequestStartTime"]!;
                var duration = DateTime.UtcNow - startTime;
                context.Response.Headers.Add("X-Response-Time-Ms", 
                    duration.TotalMilliseconds.ToString("F2"));
            }

            return Task.CompletedTask;
        });

        // Store request start time
        context.Items["RequestStartTime"] = DateTime.UtcNow;

        // Validate API version if provided in request
        if (context.Request.Headers.ContainsKey("X-API-Version"))
        {
            var requestedVersion = context.Request.Headers["X-API-Version"].ToString();
            if (!IsVersionSupported(requestedVersion))
            {
                context.Response.StatusCode = 400;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsJsonAsync(new
                {
                    error = "Unsupported API version",
                    requestedVersion = requestedVersion,
                    supportedVersions = new[] { "1.0", "v1" },
                    message = "Please use a supported API version"
                });
                return;
            }
        }

        await _next(context);
    }

    private static bool IsVersionSupported(string version)
    {
        var supportedVersions = new[] { "1.0", "1", "v1", "V1" };
        return supportedVersions.Contains(version, StringComparer.OrdinalIgnoreCase);
    }
}

public static class ApiVersioningMiddlewareExtensions
{
    public static IApplicationBuilder UseApiVersioning(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<ApiVersioningMiddleware>();
    }
}
