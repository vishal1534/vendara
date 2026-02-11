using StackExchange.Redis;
using System.Text.Json;

namespace PaymentService.Services;

public class CachingService : ICachingService
{
    private readonly IConnectionMultiplexer _redis;
    private readonly IDatabase _database;
    private readonly ILogger<CachingService> _logger;
    private readonly TimeSpan _defaultExpiration;

    public CachingService(IConnectionMultiplexer redis, IConfiguration configuration, ILogger<CachingService> logger)
    {
        _redis = redis;
        _database = redis.GetDatabase();
        _logger = logger;
        
        var ttlMinutes = configuration.GetValue<int>("Caching:DefaultTTLMinutes", 5);
        _defaultExpiration = TimeSpan.FromMinutes(ttlMinutes);
    }

    public async Task<T?> GetAsync<T>(string key)
    {
        try
        {
            var value = await _database.StringGetAsync(key);
            
            if (!value.HasValue)
            {
                return default;
            }
            
            return JsonSerializer.Deserialize<T>(value!);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting cached value for key: {Key}", key);
            return default;
        }
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null)
    {
        try
        {
            var serialized = JsonSerializer.Serialize(value);
            await _database.StringSetAsync(key, serialized, expiration ?? _defaultExpiration);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting cached value for key: {Key}", key);
        }
    }

    public async Task RemoveAsync(string key)
    {
        try
        {
            await _database.KeyDeleteAsync(key);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing cached value for key: {Key}", key);
        }
    }

    public async Task<bool> ExistsAsync(string key)
    {
        try
        {
            return await _database.KeyExistsAsync(key);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if key exists: {Key}", key);
            return false;
        }
    }
}
