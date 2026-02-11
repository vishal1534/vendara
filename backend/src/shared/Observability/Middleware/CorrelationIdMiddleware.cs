using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace RealServ.Shared.Observability.Middleware;

/// <summary>
/// Middleware for managing correlation IDs across service requests.
/// Ensures every request has a unique correlation ID for distributed tracing.
/// </summary>
/// <remarks>
/// <para>
/// The correlation ID can be:
/// 1. Provided by the client via X-Correlation-ID header
/// 2. Auto-generated if not provided
/// 3. Passed to downstream services for end-to-end tracing
/// </para>
/// <para>
/// Usage in Program.cs:
/// <code>
/// app.UseMiddleware&lt;CorrelationIdMiddleware&gt;();
/// </code>
/// </para>
/// <para>
/// Accessing the correlation ID in controllers/services:
/// <code>
/// var correlationId = HttpContext.Items["CorrelationId"]?.ToString();
/// // or
/// var correlationId = HttpContext.Request.Headers["X-Correlation-ID"].ToString();
/// </code>
/// </para>
/// </remarks>
public class CorrelationIdMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<CorrelationIdMiddleware> _logger;
    private const string CorrelationIdHeaderName = "X-Correlation-ID";

    public CorrelationIdMiddleware(RequestDelegate next, ILogger<CorrelationIdMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        string correlationId;

        // Try to get correlation ID from request header
        if (context.Request.Headers.TryGetValue(CorrelationIdHeaderName, out var existingCorrelationId) &&
            !string.IsNullOrWhiteSpace(existingCorrelationId))
        {
            correlationId = existingCorrelationId.ToString();
            _logger.LogDebug("Using existing correlation ID: {CorrelationId}", correlationId);
        }
        else
        {
            // Generate new correlation ID if not provided
            correlationId = Guid.NewGuid().ToString();
            _logger.LogDebug("Generated new correlation ID: {CorrelationId}", correlationId);
        }

        // Store correlation ID in HttpContext.Items for easy access
        context.Items["CorrelationId"] = correlationId;

        // Add correlation ID to response headers (useful for debugging)
        context.Response.OnStarting(() =>
        {
            if (!context.Response.Headers.ContainsKey(CorrelationIdHeaderName))
            {
                context.Response.Headers.Add(CorrelationIdHeaderName, correlationId);
            }
            return Task.CompletedTask;
        });

        // Add correlation ID to logger scope for all logs in this request
        using (_logger.BeginScope(new Dictionary<string, object>
        {
            ["CorrelationId"] = correlationId,
            ["RequestPath"] = context.Request.Path.Value ?? "/",
            ["RequestMethod"] = context.Request.Method
        }))
        {
            await _next(context);
        }
    }
}

/// <summary>
/// Extension methods for accessing correlation ID from HttpContext
/// </summary>
public static class CorrelationIdExtensions
{
    /// <summary>
    /// Gets the correlation ID from the current HTTP context
    /// </summary>
    public static string? GetCorrelationId(this HttpContext context)
    {
        return context.Items.TryGetValue("CorrelationId", out var correlationId)
            ? correlationId?.ToString()
            : null;
    }

    /// <summary>
    /// Adds correlation ID to an outgoing HTTP request
    /// (for service-to-service calls)
    /// </summary>
    public static void AddCorrelationId(this HttpRequestMessage request, string correlationId)
    {
        if (!string.IsNullOrWhiteSpace(correlationId))
        {
            request.Headers.Add("X-Correlation-ID", correlationId);
        }
    }
}
