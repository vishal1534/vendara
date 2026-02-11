using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Logging;
using System.Net.Http.Json;

namespace RealServ.Shared.Observability.HealthChecks;

/// <summary>
/// Health check for WhatsApp Cloud API.
/// Verifies API credentials and connectivity to Meta's WhatsApp Business API.
/// </summary>
/// <remarks>
/// <para>
/// Requires configuration:
/// <code>
/// {
///   "WhatsApp": {
///     "AccessToken": "...",
///     "PhoneNumberId": "...",
///     "BusinessAccountId": "..."
///   }
/// }
/// </code>
/// </para>
/// <para>
/// Usage in Program.cs:
/// <code>
/// builder.Services.AddHealthChecks()
///     .AddCheck&lt;WhatsAppHealthCheck&gt;("whatsapp", tags: new[] { "external", "messaging" });
/// </code>
/// </para>
/// </remarks>
public class WhatsAppHealthCheck : IHealthCheck
{
    private readonly ILogger<WhatsAppHealthCheck> _logger;
    private readonly IConfiguration _configuration;
    private readonly HttpClient _httpClient;
    private readonly string? _accessToken;
    private readonly string? _phoneNumberId;

    public WhatsAppHealthCheck(
        ILogger<WhatsAppHealthCheck> logger,
        IConfiguration configuration,
        IHttpClientFactory httpClientFactory)
    {
        _logger = logger;
        _configuration = configuration;
        _httpClient = httpClientFactory.CreateClient();
        _accessToken = configuration["WhatsApp:AccessToken"];
        _phoneNumberId = configuration["WhatsApp:PhoneNumberId"];
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Check if credentials are configured
            if (string.IsNullOrEmpty(_accessToken) || string.IsNullOrEmpty(_phoneNumberId))
            {
                _logger.LogWarning("WhatsApp health check failed: API credentials not configured");
                return HealthCheckResult.Degraded(
                    "WhatsApp API credentials not configured",
                    data: new Dictionary<string, object>
                    {
                        ["timestamp"] = DateTime.UtcNow,
                        ["warning"] = "Configure WhatsApp:AccessToken and WhatsApp:PhoneNumberId"
                    }
                );
            }

            // Make a lightweight API call to verify connectivity
            // Get phone number details (simple GET request)
            var url = $"https://graph.facebook.com/v18.0/{_phoneNumberId}";
            
            var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.Add("Authorization", $"Bearer {_accessToken}");

            var response = await _httpClient.SendAsync(request, cancellationToken);

            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadFromJsonAsync<WhatsAppPhoneNumberResponse>(cancellationToken);
                
                _logger.LogDebug("WhatsApp health check passed for phone number {PhoneNumber}", data?.DisplayPhoneNumber);
                
                return HealthCheckResult.Healthy(
                    "WhatsApp API is accessible",
                    data: new Dictionary<string, object>
                    {
                        ["timestamp"] = DateTime.UtcNow,
                        ["phoneNumberId"] = _phoneNumberId,
                        ["displayPhoneNumber"] = data?.DisplayPhoneNumber ?? "unknown",
                        ["verifiedName"] = data?.VerifiedName ?? "unknown"
                    }
                );
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogWarning(
                    "WhatsApp health check failed: API returned {StatusCode} - {Error}",
                    response.StatusCode,
                    errorContent
                );

                return HealthCheckResult.Unhealthy(
                    $"WhatsApp API error: {response.StatusCode}",
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
            _logger.LogError(ex, "WhatsApp health check failed with exception");
            return HealthCheckResult.Unhealthy(
                "WhatsApp health check failed",
                exception: ex,
                data: new Dictionary<string, object>
                {
                    ["timestamp"] = DateTime.UtcNow,
                    ["error"] = ex.Message
                }
            );
        }
    }

    private class WhatsAppPhoneNumberResponse
    {
        public string? DisplayPhoneNumber { get; set; }
        public string? VerifiedName { get; set; }
        public string? Id { get; set; }
    }
}
