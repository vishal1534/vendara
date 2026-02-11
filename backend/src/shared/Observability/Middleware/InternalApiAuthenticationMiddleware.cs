using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace RealServ.Shared.Observability.Middleware;

/// <summary>
/// Middleware for authenticating service-to-service API calls using internal API keys.
/// This prevents unauthorized internal service access in a microservices architecture.
/// </summary>
/// <remarks>
/// <para>
/// Usage in Program.cs:
/// <code>
/// app.UseWhen(
///     context => context.Request.Path.StartsWithSegments("/internal"),
///     appBuilder => appBuilder.UseMiddleware&lt;InternalApiAuthenticationMiddleware&gt;()
/// );
/// </code>
/// </para>
/// <para>
/// Configuration in appsettings.json:
/// <code>
/// {
///   "InternalApiKeys": {
///     "IdentityService": "your-secret-key-identity",
///     "OrderService": "your-secret-key-order",
///     "PaymentService": "your-secret-key-payment"
///   }
/// }
/// </code>
/// </para>
/// <para>
/// When calling another service:
/// <code>
/// request.Headers.Add("X-Internal-API-Key", _config["InternalApiKeys:PaymentService"]);
/// </code>
/// </para>
/// </remarks>
public class InternalApiAuthenticationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<InternalApiAuthenticationMiddleware> _logger;
    private readonly HashSet<string> _validApiKeys;

    public InternalApiAuthenticationMiddleware(
        RequestDelegate next,
        ILogger<InternalApiAuthenticationMiddleware> logger,
        IConfiguration configuration)
    {
        _next = next;
        _logger = logger;

        // Load all internal API keys from configuration
        _validApiKeys = new HashSet<string>();
        var internalApiKeys = configuration.GetSection("InternalApiKeys").GetChildren();
        
        foreach (var keyConfig in internalApiKeys)
        {
            var apiKey = keyConfig.Value;
            if (!string.IsNullOrEmpty(apiKey))
            {
                _validApiKeys.Add(apiKey);
            }
        }

        if (_validApiKeys.Count == 0)
        {
            _logger.LogWarning(
                "No internal API keys configured. Service-to-service authentication will fail. " +
                "Configure InternalApiKeys section in appsettings.json"
            );
        }
    }

    public async Task InvokeAsync(HttpContext context)
    {
        const string ApiKeyHeaderName = "X-Internal-API-Key";

        // Check if API key header exists
        if (!context.Request.Headers.TryGetValue(ApiKeyHeaderName, out var extractedApiKey))
        {
            _logger.LogWarning(
                "Internal API call to {Path} rejected: Missing {HeaderName} header from IP {IP}",
                context.Request.Path,
                ApiKeyHeaderName,
                context.Connection.RemoteIpAddress
            );

            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsJsonAsync(new
            {
                error = "Unauthorized",
                message = "Internal API key required for service-to-service calls",
                statusCode = 401
            });
            return;
        }

        var providedApiKey = extractedApiKey.ToString();

        // Validate API key
        if (string.IsNullOrEmpty(providedApiKey) || !_validApiKeys.Contains(providedApiKey))
        {
            _logger.LogWarning(
                "Internal API call to {Path} rejected: Invalid API key from IP {IP}",
                context.Request.Path,
                context.Connection.RemoteIpAddress
            );

            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsJsonAsync(new
            {
                error = "Unauthorized",
                message = "Invalid internal API key",
                statusCode = 401
            });
            return;
        }

        // Log successful authentication
        _logger.LogInformation(
            "Internal API call to {Path} authenticated successfully",
            context.Request.Path
        );

        await _next(context);
    }
}
