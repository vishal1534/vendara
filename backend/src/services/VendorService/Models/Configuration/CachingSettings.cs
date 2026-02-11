namespace VendorService.Models.Configuration;

/// <summary>
/// Caching configuration settings
/// </summary>
public class CachingSettings
{
    public int DefaultExpirationMinutes { get; set; } = 60;
    public int ShortExpirationMinutes { get; set; } = 5;
    public int LongExpirationMinutes { get; set; } = 120;
}
