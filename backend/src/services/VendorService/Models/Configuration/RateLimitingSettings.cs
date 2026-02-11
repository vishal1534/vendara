namespace VendorService.Models.Configuration;

/// <summary>
/// Rate limiting configuration settings
/// </summary>
public class RateLimitingSettings
{
    public int PermitLimit { get; set; } = 100;
    public int Window { get; set; } = 60; // seconds
    public int QueueLimit { get; set; } = 0;
}
