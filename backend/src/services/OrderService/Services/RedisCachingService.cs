using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;

namespace OrderService.Services;

public class RedisCachingService : ICachingService
{
    private readonly IDistributedCache _distributedCache;
    private readonly ILogger<RedisCachingService> _logger;
    private readonly JsonSerializerOptions _jsonOptions;

    public RedisCachingService(
        IDistributedCache distributedCache,
        ILogger<RedisCachingService> logger)
    {
        _distributedCache = distributedCache;
        _logger = logger;
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            WriteIndented = false
        };
    }

    public async Task<T?> GetAsync<T>(string key) where T : class
    {
        try
        {
            var cachedData = await _distributedCache.GetStringAsync(key);
            
            if (string.IsNullOrEmpty(cachedData))
                return null;

            return JsonSerializer.Deserialize<T>(cachedData, _jsonOptions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving data from cache for key: {Key}", key);
            return null;
        }
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null) where T : class
    {
        try
        {
            var serializedData = JsonSerializer.Serialize(value, _jsonOptions);
            
            var options = new DistributedCacheEntryOptions();
            if (expiration.HasValue)
            {
                options.AbsoluteExpirationRelativeToNow = expiration.Value;
            }
            else
            {
                options.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1);
            }

            await _distributedCache.SetStringAsync(key, serializedData, options);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error caching data for key: {Key}", key);
        }
    }

    public async Task RemoveAsync(string key)
    {
        try
        {
            await _distributedCache.RemoveAsync(key);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing cache for key: {Key}", key);
        }
    }

    public async Task RemoveByPatternAsync(string pattern)
    {
        // Note: Pattern-based removal is not directly supported by IDistributedCache
        // This would require direct Redis connection for SCAN command
        // For now, we'll log a warning
        _logger.LogWarning("Pattern-based cache removal not implemented: {Pattern}", pattern);
        await Task.CompletedTask;
    }
}
