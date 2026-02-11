using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Logging;

namespace RealServ.Shared.Observability.HealthChecks;

/// <summary>
/// Health check for AWS S3 service.
/// Verifies S3 bucket accessibility and AWS credentials.
/// </summary>
/// <remarks>
/// <para>
/// Requires configuration:
/// <code>
/// {
///   "AWS": {
///     "Region": "ap-south-1",
///     "S3BucketName": "realserv-media-dev"
///   }
/// }
/// </code>
/// </para>
/// <para>
/// Usage in Program.cs:
/// <code>
/// builder.Services.AddHealthChecks()
///     .AddCheck&lt;S3HealthCheck&gt;("s3", tags: new[] { "external", "storage" });
/// </code>
/// </para>
/// </remarks>
public class S3HealthCheck : IHealthCheck
{
    private readonly ILogger<S3HealthCheck> _logger;
    private readonly IConfiguration _configuration;
    private readonly IAmazonS3? _s3Client;
    private readonly string? _bucketName;

    public S3HealthCheck(
        ILogger<S3HealthCheck> logger,
        IConfiguration configuration,
        IAmazonS3? s3Client = null)
    {
        _logger = logger;
        _configuration = configuration;
        _s3Client = s3Client;
        _bucketName = configuration["AWS:S3BucketName"];
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Check if S3 client is configured
            if (_s3Client == null)
            {
                _logger.LogWarning("S3 health check failed: IAmazonS3 client not registered");
                return HealthCheckResult.Degraded(
                    "S3 client not configured",
                    data: new Dictionary<string, object>
                    {
                        ["timestamp"] = DateTime.UtcNow,
                        ["warning"] = "Register IAmazonS3 in dependency injection"
                    }
                );
            }

            // Check if bucket name is configured
            if (string.IsNullOrEmpty(_bucketName))
            {
                _logger.LogWarning("S3 health check failed: Bucket name not configured");
                return HealthCheckResult.Degraded(
                    "S3 bucket name not configured",
                    data: new Dictionary<string, object>
                    {
                        ["timestamp"] = DateTime.UtcNow,
                        ["warning"] = "Configure AWS:S3BucketName in appsettings.json"
                    }
                );
            }

            // Make a lightweight API call to verify bucket access
            // GetBucketLocation is a simple operation that verifies:
            // 1. AWS credentials are valid
            // 2. Bucket exists
            // 3. We have permission to access it
            var request = new GetBucketLocationRequest
            {
                BucketName = _bucketName
            };

            var response = await _s3Client.GetBucketLocationAsync(request, cancellationToken);

            _logger.LogDebug(
                "S3 health check passed for bucket {BucketName} in region {Region}",
                _bucketName,
                response.Location.Value
            );

            return HealthCheckResult.Healthy(
                "S3 bucket is accessible",
                data: new Dictionary<string, object>
                {
                    ["timestamp"] = DateTime.UtcNow,
                    ["bucketName"] = _bucketName,
                    ["region"] = response.Location.Value
                }
            );
        }
        catch (AmazonS3Exception s3Ex)
        {
            // S3-specific errors (bucket not found, access denied, etc.)
            _logger.LogWarning(
                s3Ex,
                "S3 health check failed: {ErrorCode} - {Message}",
                s3Ex.ErrorCode,
                s3Ex.Message
            );

            var isUnhealthy = s3Ex.ErrorCode == "AccessDenied" || 
                             s3Ex.ErrorCode == "InvalidAccessKeyId" ||
                             s3Ex.ErrorCode == "SignatureDoesNotMatch";

            return isUnhealthy
                ? HealthCheckResult.Unhealthy(
                    $"S3 error: {s3Ex.Message}",
                    exception: s3Ex,
                    data: new Dictionary<string, object>
                    {
                        ["timestamp"] = DateTime.UtcNow,
                        ["errorCode"] = s3Ex.ErrorCode,
                        ["bucketName"] = _bucketName ?? "unknown"
                    })
                : HealthCheckResult.Degraded(
                    $"S3 error: {s3Ex.Message}",
                    exception: s3Ex,
                    data: new Dictionary<string, object>
                    {
                        ["timestamp"] = DateTime.UtcNow,
                        ["errorCode"] = s3Ex.ErrorCode,
                        ["bucketName"] = _bucketName ?? "unknown"
                    });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "S3 health check failed with exception");
            return HealthCheckResult.Unhealthy(
                "S3 health check failed",
                exception: ex,
                data: new Dictionary<string, object>
                {
                    ["timestamp"] = DateTime.UtcNow,
                    ["error"] = ex.Message,
                    ["bucketName"] = _bucketName ?? "unknown"
                }
            );
        }
    }
}
