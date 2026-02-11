namespace RealServ.Shared.Observability.Configuration;

/// <summary>
/// Configuration options for AWS CloudWatch integration
/// </summary>
public class CloudWatchOptions
{
    public const string SectionName = "CloudWatch";

    /// <summary>
    /// AWS Region (e.g., "ap-south-1" for Mumbai)
    /// </summary>
    public string Region { get; set; } = "ap-south-1";

    /// <summary>
    /// CloudWatch Log Group name (e.g., "/realserv/identity-service")
    /// </summary>
    public string LogGroupName { get; set; } = string.Empty;

    /// <summary>
    /// CloudWatch Log Stream name prefix (defaults to service name)
    /// </summary>
    public string LogStreamPrefix { get; set; } = string.Empty;

    /// <summary>
    /// Enable CloudWatch logging (disable for local development)
    /// </summary>
    public bool EnableCloudWatch { get; set; } = false;

    /// <summary>
    /// Minimum log level to send to CloudWatch
    /// </summary>
    public string MinimumLevel { get; set; } = "Information";

    /// <summary>
    /// Batch size for log submissions (1-10000)
    /// </summary>
    public int BatchSizeLimit { get; set; } = 100;

    /// <summary>
    /// Period to wait between checking for event batches (seconds)
    /// </summary>
    public int Period { get; set; } = 10;

    /// <summary>
    /// Enable custom metrics publishing
    /// </summary>
    public bool EnableMetrics { get; set; } = true;

    /// <summary>
    /// CloudWatch namespace for custom metrics (e.g., "RealServ/IdentityService")
    /// </summary>
    public string MetricsNamespace { get; set; } = "RealServ";

    /// <summary>
    /// AWS Access Key ID (prefer using IAM roles in production)
    /// </summary>
    public string? AccessKeyId { get; set; }

    /// <summary>
    /// AWS Secret Access Key (prefer using IAM roles in production)
    /// </summary>
    public string? SecretAccessKey { get; set; }

    /// <summary>
    /// Enable detailed error logging
    /// </summary>
    public bool LogErrorDetails { get; set; } = true;

    /// <summary>
    /// Enable request/response logging
    /// </summary>
    public bool LogHttpRequests { get; set; } = true;

    /// <summary>
    /// Enable performance metrics tracking
    /// </summary>
    public bool EnablePerformanceTracking { get; set; } = true;
}
