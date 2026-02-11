using Microsoft.Extensions.Options;
using IntegrationService.Data;
using IntegrationService.Models.Configuration;

namespace IntegrationService.Services;

/// <summary>
/// Background service that periodically cleans up expired location cache entries
/// Runs at configured interval (default: daily)
/// </summary>
public class LocationCacheCleanupService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<LocationCacheCleanupService> _logger;
    private readonly LocationCacheSettings _settings;

    public LocationCacheCleanupService(
        IServiceProvider serviceProvider,
        IOptions<LocationCacheSettings> settings,
        ILogger<LocationCacheCleanupService> logger)
    {
        _serviceProvider = serviceProvider;
        _settings = settings.Value;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (!_settings.EnableAutomaticCleanup)
        {
            _logger.LogInformation("LocationCacheCleanupService: Automatic cleanup is disabled");
            return;
        }

        _logger.LogInformation("LocationCacheCleanupService: Starting with interval of {Hours} hours", 
            _settings.CleanupIntervalHours);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await Task.Delay(TimeSpan.FromHours(_settings.CleanupIntervalHours), stoppingToken);
                
                if (stoppingToken.IsCancellationRequested)
                    break;

                await CleanupExpiredCacheAsync();
            }
            catch (TaskCanceledException)
            {
                // Normal shutdown
                _logger.LogInformation("LocationCacheCleanupService: Shutdown requested");
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "LocationCacheCleanupService: Error during cleanup execution");
                // Continue running even if cleanup fails
            }
        }

        _logger.LogInformation("LocationCacheCleanupService: Stopped");
    }

    private async Task CleanupExpiredCacheAsync()
    {
        using var scope = _serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<IntegrationDbContext>();

        try
        {
            _logger.LogInformation("LocationCacheCleanupService: Starting cleanup of expired cache entries");

            var expirationDate = DateTime.UtcNow.AddDays(-_settings.ExpirationDays);

            // Find expired cache entries
            var expiredEntries = dbContext.LocationCaches
                .Where(lc => lc.CreatedAt < expirationDate)
                .ToList();

            if (!expiredEntries.Any())
            {
                _logger.LogInformation("LocationCacheCleanupService: No expired entries found");
                return;
            }

            _logger.LogInformation("LocationCacheCleanupService: Found {Count} expired entries to delete", 
                expiredEntries.Count);

            // Delete expired entries
            dbContext.LocationCaches.RemoveRange(expiredEntries);
            await dbContext.SaveChangesAsync();

            _logger.LogInformation("LocationCacheCleanupService: Successfully deleted {Count} expired cache entries", 
                expiredEntries.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "LocationCacheCleanupService: Error cleaning up expired cache entries");
            throw;
        }
    }

    public override async Task StartAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("LocationCacheCleanupService: Service is starting");
        await base.StartAsync(cancellationToken);
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("LocationCacheCleanupService: Service is stopping");
        await base.StopAsync(cancellationToken);
    }
}
