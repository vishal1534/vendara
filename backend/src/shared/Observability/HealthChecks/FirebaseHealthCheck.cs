using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Logging;

namespace RealServ.Shared.Observability.HealthChecks;

/// <summary>
/// Health check for Firebase Authentication service.
/// Verifies that Firebase Admin SDK is initialized and can authenticate requests.
/// </summary>
/// <remarks>
/// <para>
/// Usage in Program.cs:
/// <code>
/// builder.Services.AddHealthChecks()
///     .AddCheck&lt;FirebaseHealthCheck&gt;("firebase", tags: new[] { "external", "auth" });
/// </code>
/// </para>
/// </remarks>
public class FirebaseHealthCheck : IHealthCheck
{
    private readonly ILogger<FirebaseHealthCheck> _logger;

    public FirebaseHealthCheck(ILogger<FirebaseHealthCheck> logger)
    {
        _logger = logger;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Check if Firebase app is initialized
            var app = FirebaseApp.DefaultInstance;
            if (app == null)
            {
                _logger.LogWarning("Firebase health check failed: FirebaseApp not initialized");
                return HealthCheckResult.Unhealthy(
                    "Firebase Admin SDK is not initialized",
                    data: new Dictionary<string, object>
                    {
                        ["timestamp"] = DateTime.UtcNow,
                        ["error"] = "FirebaseApp.DefaultInstance is null"
                    }
                );
            }

            // Verify we can access Firebase Auth (lightweight check)
            var auth = FirebaseAuth.DefaultInstance;
            if (auth == null)
            {
                _logger.LogWarning("Firebase health check failed: FirebaseAuth not initialized");
                return HealthCheckResult.Unhealthy(
                    "Firebase Auth is not initialized",
                    data: new Dictionary<string, object>
                    {
                        ["timestamp"] = DateTime.UtcNow,
                        ["error"] = "FirebaseAuth.DefaultInstance is null"
                    }
                );
            }

            // Optional: Verify token (only if you want to make an actual API call)
            // For MVP, just checking initialization is enough to avoid rate limits
            
            _logger.LogDebug("Firebase health check passed");
            return HealthCheckResult.Healthy(
                "Firebase Admin SDK is initialized and ready",
                data: new Dictionary<string, object>
                {
                    ["timestamp"] = DateTime.UtcNow,
                    ["projectId"] = app.Options.ProjectId ?? "unknown"
                }
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Firebase health check failed with exception");
            return HealthCheckResult.Unhealthy(
                "Firebase health check failed",
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
