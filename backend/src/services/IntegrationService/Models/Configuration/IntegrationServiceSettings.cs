using System.ComponentModel.DataAnnotations;

namespace IntegrationService.Models.Configuration;

/// <summary>
/// WhatsApp configuration settings with validation
/// </summary>
public class WhatsAppSettings
{
    public const string SectionName = "WhatsApp";

    [Required(ErrorMessage = "WhatsApp API URL is required")]
    [Url(ErrorMessage = "WhatsApp API URL must be a valid URL")]
    public string ApiUrl { get; set; } = string.Empty;

    [Required(ErrorMessage = "WhatsApp Phone Number ID is required")]
    public string PhoneNumberId { get; set; } = string.Empty;

    [Required(ErrorMessage = "WhatsApp Access Token is required")]
    [MinLength(50, ErrorMessage = "WhatsApp Access Token seems invalid (too short)")]
    public string AccessToken { get; set; } = string.Empty;

    [Required(ErrorMessage = "WhatsApp App Secret is required for webhook signature validation")]
    [MinLength(20, ErrorMessage = "WhatsApp App Secret seems invalid (too short)")]
    public string AppSecret { get; set; } = string.Empty;

    [Required(ErrorMessage = "WhatsApp Verify Token is required")]
    [MinLength(10, ErrorMessage = "WhatsApp Verify Token should be at least 10 characters")]
    public string VerifyToken { get; set; } = string.Empty;

    [Required(ErrorMessage = "WhatsApp Business Account ID is required")]
    public string BusinessAccountId { get; set; } = string.Empty;
}

/// <summary>
/// AWS S3 configuration settings with validation
/// </summary>
public class AwsSettings
{
    public const string SectionName = "AWS";

    [Required(ErrorMessage = "AWS Region is required")]
    public string Region { get; set; } = "ap-south-1";

    [Required]
    public S3Settings S3 { get; set; } = new();
}

public class S3Settings
{
    [Required(ErrorMessage = "S3 Bucket Name is required")]
    [MinLength(3, ErrorMessage = "S3 Bucket Name must be at least 3 characters")]
    [MaxLength(63, ErrorMessage = "S3 Bucket Name cannot exceed 63 characters")]
    public string BucketName { get; set; } = string.Empty;

    [Required(ErrorMessage = "S3 Media URL Prefix is required")]
    [Url(ErrorMessage = "S3 Media URL Prefix must be a valid URL")]
    public string MediaUrlPrefix { get; set; } = string.Empty;
}

/// <summary>
/// Google Maps configuration settings with validation
/// </summary>
public class GoogleMapsSettings
{
    public const string SectionName = "GoogleMaps";

    [Required(ErrorMessage = "Google Maps API Key is required")]
    [MinLength(30, ErrorMessage = "Google Maps API Key seems invalid (too short)")]
    public string ApiKey { get; set; } = string.Empty;

    [Required(ErrorMessage = "Default Country is required")]
    [StringLength(2, MinimumLength = 2, ErrorMessage = "Country code must be 2 characters (ISO 3166-1 alpha-2)")]
    public string DefaultCountry { get; set; } = "IN";

    [Required(ErrorMessage = "Default City is required")]
    public string DefaultCity { get; set; } = "Hyderabad";
}

/// <summary>
/// File upload limits configuration
/// </summary>
public class FileUploadSettings
{
    public const string SectionName = "FileUpload";

    /// <summary>
    /// Maximum file size in bytes (default: 100 MB)
    /// </summary>
    [Range(1024, 1073741824, ErrorMessage = "Max file size must be between 1KB and 1GB")]
    public long MaxFileSizeBytes { get; set; } = 100 * 1024 * 1024;

    /// <summary>
    /// Maximum number of files in batch upload
    /// </summary>
    [Range(1, 50, ErrorMessage = "Max files count must be between 1 and 50")]
    public int MaxFilesCount { get; set; } = 10;
}

/// <summary>
/// Location cache configuration
/// </summary>
public class LocationCacheSettings
{
    public const string SectionName = "LocationCache";

    /// <summary>
    /// Cache expiration in days (default: 90 days)
    /// </summary>
    [Range(1, 365, ErrorMessage = "Cache expiration must be between 1 and 365 days")]
    public int ExpirationDays { get; set; } = 90;

    /// <summary>
    /// Enable automatic cleanup of expired cache entries
    /// </summary>
    public bool EnableAutomaticCleanup { get; set; } = true;

    /// <summary>
    /// Cleanup interval in hours (default: 24 hours = daily)
    /// </summary>
    [Range(1, 168, ErrorMessage = "Cleanup interval must be between 1 and 168 hours (1 week)")]
    public int CleanupIntervalHours { get; set; } = 24;
}

/// <summary>
/// Retry policy configuration
/// </summary>
public class RetryPolicySettings
{
    public const string SectionName = "RetryPolicy";

    /// <summary>
    /// Number of retry attempts (default: 3)
    /// </summary>
    [Range(0, 10, ErrorMessage = "Retry count must be between 0 and 10")]
    public int RetryCount { get; set; } = 3;

    /// <summary>
    /// Base delay in seconds for exponential backoff (default: 2)
    /// </summary>
    [Range(1, 60, ErrorMessage = "Base delay must be between 1 and 60 seconds")]
    public int BaseDelaySeconds { get; set; } = 2;
}

/// <summary>
/// Circuit breaker configuration
/// </summary>
public class CircuitBreakerSettings
{
    public const string SectionName = "CircuitBreaker";

    /// <summary>
    /// Number of consecutive failures before opening circuit (default: 5)
    /// </summary>
    [Range(1, 100, ErrorMessage = "Failure threshold must be between 1 and 100")]
    public int FailureThreshold { get; set; } = 5;

    /// <summary>
    /// Duration to keep circuit open in seconds (default: 30)
    /// </summary>
    [Range(1, 300, ErrorMessage = "Open duration must be between 1 and 300 seconds")]
    public int OpenDurationSeconds { get; set; } = 30;
}
