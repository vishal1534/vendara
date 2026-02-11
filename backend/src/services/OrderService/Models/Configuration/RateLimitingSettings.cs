namespace OrderService.Models.Configuration;

public class RateLimitingSettings
{
    public int PermitLimit { get; set; } = 100;
    public int Window { get; set; } = 60; // seconds
    public int QueueLimit { get; set} = 0;
}
