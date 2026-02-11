using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Logging;
using Razorpay.Api;

namespace RealServ.Shared.Observability.HealthChecks;

/// <summary>
/// Health check for Razorpay payment gateway.
/// Verifies API credentials and connectivity to Razorpay API.
/// </summary>
/// <remarks>
/// <para>
/// Requires configuration:
/// <code>
/// {
///   "Razorpay": {
///     "KeyId": "rzp_test_...",
///     "KeySecret": "..."
///   }
/// }
/// </code>
/// </para>
/// <para>
/// Usage in Program.cs:
/// <code>
/// builder.Services.AddHealthChecks()
///     .AddCheck&lt;RazorpayHealthCheck&gt;("razorpay", tags: new[] { "external", "payment" });
/// </code>
/// </para>
/// </remarks>
public class RazorpayHealthCheck : IHealthCheck
{
    private readonly ILogger<RazorpayHealthCheck> _logger;
    private readonly IConfiguration _configuration;
    private readonly string? _keyId;
    private readonly string? _keySecret;

    public RazorpayHealthCheck(
        ILogger<RazorpayHealthCheck> logger,
        IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
        _keyId = configuration["Razorpay:KeyId"];
        _keySecret = configuration["Razorpay:KeySecret"];
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Check if credentials are configured
            if (string.IsNullOrEmpty(_keyId) || string.IsNullOrEmpty(_keySecret))
            {
                _logger.LogWarning("Razorpay health check failed: API credentials not configured");
                return HealthCheckResult.Degraded(
                    "Razorpay API credentials not configured",
                    data: new Dictionary<string, object>
                    {
                        ["timestamp"] = DateTime.UtcNow,
                        ["warning"] = "Configure Razorpay:KeyId and Razorpay:KeySecret"
                    }
                );
            }

            // Create Razorpay client
            var client = new RazorpayClient(_keyId, _keySecret);

            // Make a lightweight API call to verify connectivity
            // Fetch keys (this is a simple GET request that verifies API access)
            try
            {
                // Try to fetch account details (lightweight operation)
                // In production, you might want to cache this result to avoid rate limits
                var response = await Task.Run(() => client.Key.FetchAll(), cancellationToken);
                
                _logger.LogDebug("Razorpay health check passed");
                return HealthCheckResult.Healthy(
                    "Razorpay API is accessible",
                    data: new Dictionary<string, object>
                    {
                        ["timestamp"] = DateTime.UtcNow,
                        ["environment"] = _keyId.StartsWith("rzp_test_") ? "test" : "live"
                    }
                );
            }
            catch (Razorpay.Api.Errors.Error razorpayError)
            {
                // Razorpay API error (401, 403, etc.)
                _logger.LogWarning(
                    razorpayError,
                    "Razorpay health check failed: API error {StatusCode}",
                    razorpayError.Error["code"]
                );

                return HealthCheckResult.Unhealthy(
                    $"Razorpay API error: {razorpayError.Error["description"]}",
                    exception: razorpayError,
                    data: new Dictionary<string, object>
                    {
                        ["timestamp"] = DateTime.UtcNow,
                        ["errorCode"] = razorpayError.Error["code"]?.ToString() ?? "unknown",
                        ["errorDescription"] = razorpayError.Error["description"]?.ToString() ?? "unknown"
                    }
                );
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Razorpay health check failed with exception");
            return HealthCheckResult.Unhealthy(
                "Razorpay health check failed",
                exception: ex,
                data: new Dictionary<string, object>
                {
                    ["timestamp"] = DateTime.UtcNow,
                    ["error"] = ex.Message
                }
            );
        }
    }
}
