namespace OrderService.Models.Configuration;

public class CachingSettings
{
    public int DefaultExpirationMinutes { get; set; } = 60;
    public int ShortExpirationMinutes { get; set; } = 5;
    public int LongExpirationMinutes { get; set; } = 120;
}
