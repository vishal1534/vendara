using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Logging;
using System.Net.Http.Json;

namespace RealServ.Shared.Observability.HealthChecks;

/// <summary>
/// Health check for Google Maps API (Geocoding).
/// Verifies API key and connectivity to Google Maps services.
/// </summary>
/// <remarks>
/// <para>
/// Requires configuration:
/// <code>
/// {
///   "GoogleMaps": {
///     "ApiKey": "..."
///   }
/// }
/// </code>
/// </para>
/// <para>
/// Usage in Program.cs:
/// <code>
/// builder.Services.AddHealthChecks()
///     .AddCheck&lt;GoogleMapsHealthCheck&gt;("googlemaps", tags: new[] { "external", "location" });
/// </code>
/// </para>
/// </remarks>
public class GoogleMapsHealthCheck : IHealthCheck
{
    private readonly ILogger<GoogleMapsHealthCheck> _logger;
    private readonly IConfiguration _configuration;
    private readonly HttpClient _httpClient;
    private readonly string? _apiKey;

    public GoogleMapsHealthCheck(
        ILogger<GoogleMapsHealthCheck> logger,
        IConfiguration configuration,
        IHttpClientFactory httpClientFactory)
    {
        _logger = logger;
        _configuration = configuration;
        _httpClient = httpClientFactory.CreateClient();
        _apiKey = configuration["GoogleMaps:ApiKey"];
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Check if API key is configured
            if (string.IsNullOrEmpty(_apiKey))
            {
                _logger.LogWarning("Google Maps health check failed: API key not configured");
                return HealthCheckResult.Degraded(
                    "Google Maps API key not configured",
                    data: new Dictionary<string, object>
                    {
                        ["timestamp"] = DateTime.UtcNow,
                        ["warning"] = "Configure GoogleMaps:ApiKey in appsettings.json"
                    }
                );
            }

            // Make a lightweight API call to verify connectivity
            // Geocode a known location (Google HQ) - this is cached by Google, so very fast
            var url = $"https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key={_apiKey}";
            
            var response = await _httpClient.GetAsync(url, cancellationToken);

            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadFromJsonAsync<GoogleMapsGeocodingResponse>(cancellationToken);
                
                if (data?.Status == "OK")
                {
                    _logger.LogDebug("Google Maps health check passed");
                    return HealthCheckResult.Healthy(
                        "Google Maps API is accessible",
                        data: new Dictionary<string, object>
                        {
                            ["timestamp"] = DateTime.UtcNow,
                            ["status"] = data.Status
                        }
                    );
                }
                else if (data?.Status == "REQUEST_DENIED")
                {
                    _logger.LogWarning(
                        "Google Maps health check failed: Request denied - {ErrorMessage}",
                        data.ErrorMessage
                    );
                    return HealthCheckResult.Unhealthy(
                        $"Google Maps API request denied: {data.ErrorMessage}",
                        data: new Dictionary<string, object>
                        {
                            ["timestamp"] = DateTime.UtcNow,
                            ["status"] = data.Status,
                            ["error"] = data.ErrorMessage ?? "unknown"
                        }
                    );
                }
                else
                {
                    _logger.LogWarning(
                        "Google Maps health check failed: Unexpected status {Status}",
                        data?.Status
                    );
                    return HealthCheckResult.Degraded(
                        $"Google Maps API returned status: {data?.Status}",
                        data: new Dictionary<string, object>
                        {
                            ["timestamp"] = DateTime.UtcNow,
                            ["status"] = data?.Status ?? "unknown"
                        }
                    );
                }
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogWarning(
                    "Google Maps health check failed: HTTP {StatusCode} - {Error}",
                    response.StatusCode,
                    errorContent
                );

                return HealthCheckResult.Unhealthy(
                    $"Google Maps API error: {response.StatusCode}",
                    data: new Dictionary<string, object>
                    {
                        ["timestamp"] = DateTime.UtcNow,
                        ["statusCode"] = (int)response.StatusCode,
                        ["error"] = errorContent
                    }
                );
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Google Maps health check failed with exception");
            return HealthCheckResult.Unhealthy(
                "Google Maps health check failed",
                exception: ex,
                data: new Dictionary<string, object>
                {
                    ["timestamp"] = DateTime.UtcNow,
                    ["error"] = ex.Message
                }
            );
        }
    }

    private class GoogleMapsGeocodingResponse
    {
        public string? Status { get; set; }
        public string? ErrorMessage { get; set; }
        public List<object>? Results { get; set; }
    }
}
