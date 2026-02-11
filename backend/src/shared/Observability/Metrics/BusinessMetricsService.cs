using Microsoft.Extensions.Logging;

namespace RealServ.Shared.Observability.Metrics;

/// <summary>
/// Service for publishing business-specific metrics to CloudWatch
/// </summary>
public interface IBusinessMetricsService
{
    // User metrics
    Task TrackUserRegistrationAsync(string userType);
    Task TrackUserLoginAsync(string userType);
    Task TrackUserLoginFailureAsync(string userType, string reason);

    // Order metrics
    Task TrackOrderCreatedAsync(string orderType, decimal orderValue);
    Task TrackOrderStatusChangeAsync(string fromStatus, string toStatus);
    Task TrackOrderCancelledAsync(string reason);

    // Payment metrics
    Task TrackPaymentInitiatedAsync(string paymentMethod, decimal amount);
    Task TrackPaymentSuccessAsync(string paymentMethod, decimal amount);
    Task TrackPaymentFailureAsync(string paymentMethod, string reason);

    // Vendor metrics
    Task TrackVendorOnboardedAsync(string vendorType);
    Task TrackVendorStatusChangeAsync(string fromStatus, string toStatus);
    Task TrackInventoryUpdateAsync(string vendorId, int itemCount);

    // Performance metrics
    Task TrackDatabaseQueryAsync(string queryName, double durationMs);
    Task TrackExternalApiCallAsync(string apiName, double durationMs, bool success);
    Task TrackCacheHitAsync(string cacheKey);
    Task TrackCacheMissAsync(string cacheKey);
}

public class BusinessMetricsService : IBusinessMetricsService
{
    private readonly ICloudWatchMetricsPublisher _metricsPublisher;
    private readonly ILogger<BusinessMetricsService> _logger;

    public BusinessMetricsService(
        ICloudWatchMetricsPublisher metricsPublisher,
        ILogger<BusinessMetricsService> logger)
    {
        _metricsPublisher = metricsPublisher;
        _logger = logger;
    }

    // User Metrics
    public async Task TrackUserRegistrationAsync(string userType)
    {
        var dimensions = new Dictionary<string, string> { { "UserType", userType } };
        await _metricsPublisher.PublishCounterAsync("UserRegistration", 1, dimensions);
        _logger.LogInformation("User registration tracked: {UserType}", userType);
    }

    public async Task TrackUserLoginAsync(string userType)
    {
        var dimensions = new Dictionary<string, string> { { "UserType", userType } };
        await _metricsPublisher.PublishCounterAsync("UserLogin", 1, dimensions);
    }

    public async Task TrackUserLoginFailureAsync(string userType, string reason)
    {
        var dimensions = new Dictionary<string, string>
        {
            { "UserType", userType },
            { "Reason", reason }
        };
        await _metricsPublisher.PublishCounterAsync("UserLoginFailure", 1, dimensions);
        _logger.LogWarning("Login failure tracked: {UserType}, Reason: {Reason}", userType, reason);
    }

    // Order Metrics
    public async Task TrackOrderCreatedAsync(string orderType, decimal orderValue)
    {
        var dimensions = new Dictionary<string, string> { { "OrderType", orderType } };
        await _metricsPublisher.PublishCounterAsync("OrderCreated", 1, dimensions);
        await _metricsPublisher.PublishGaugeAsync("OrderValue", (double)orderValue, dimensions);
        _logger.LogInformation("Order created: {OrderType}, Value: {OrderValue}", orderType, orderValue);
    }

    public async Task TrackOrderStatusChangeAsync(string fromStatus, string toStatus)
    {
        var dimensions = new Dictionary<string, string>
        {
            { "FromStatus", fromStatus },
            { "ToStatus", toStatus }
        };
        await _metricsPublisher.PublishCounterAsync("OrderStatusChange", 1, dimensions);
    }

    public async Task TrackOrderCancelledAsync(string reason)
    {
        var dimensions = new Dictionary<string, string> { { "Reason", reason } };
        await _metricsPublisher.PublishCounterAsync("OrderCancelled", 1, dimensions);
        _logger.LogWarning("Order cancelled: {Reason}", reason);
    }

    // Payment Metrics
    public async Task TrackPaymentInitiatedAsync(string paymentMethod, decimal amount)
    {
        var dimensions = new Dictionary<string, string> { { "PaymentMethod", paymentMethod } };
        await _metricsPublisher.PublishCounterAsync("PaymentInitiated", 1, dimensions);
        await _metricsPublisher.PublishGaugeAsync("PaymentAmount", (double)amount, dimensions);
    }

    public async Task TrackPaymentSuccessAsync(string paymentMethod, decimal amount)
    {
        var dimensions = new Dictionary<string, string> { { "PaymentMethod", paymentMethod } };
        await _metricsPublisher.PublishCounterAsync("PaymentSuccess", 1, dimensions);
        await _metricsPublisher.PublishGaugeAsync("PaymentSuccessAmount", (double)amount, dimensions);
        _logger.LogInformation("Payment success: {PaymentMethod}, Amount: {Amount}", paymentMethod, amount);
    }

    public async Task TrackPaymentFailureAsync(string paymentMethod, string reason)
    {
        var dimensions = new Dictionary<string, string>
        {
            { "PaymentMethod", paymentMethod },
            { "Reason", reason }
        };
        await _metricsPublisher.PublishCounterAsync("PaymentFailure", 1, dimensions);
        _logger.LogError("Payment failure: {PaymentMethod}, Reason: {Reason}", paymentMethod, reason);
    }

    // Vendor Metrics
    public async Task TrackVendorOnboardedAsync(string vendorType)
    {
        var dimensions = new Dictionary<string, string> { { "VendorType", vendorType } };
        await _metricsPublisher.PublishCounterAsync("VendorOnboarded", 1, dimensions);
        _logger.LogInformation("Vendor onboarded: {VendorType}", vendorType);
    }

    public async Task TrackVendorStatusChangeAsync(string fromStatus, string toStatus)
    {
        var dimensions = new Dictionary<string, string>
        {
            { "FromStatus", fromStatus },
            { "ToStatus", toStatus }
        };
        await _metricsPublisher.PublishCounterAsync("VendorStatusChange", 1, dimensions);
    }

    public async Task TrackInventoryUpdateAsync(string vendorId, int itemCount)
    {
        var dimensions = new Dictionary<string, string> { { "VendorId", vendorId } };
        await _metricsPublisher.PublishGaugeAsync("InventoryItemCount", itemCount, dimensions);
    }

    // Performance Metrics
    public async Task TrackDatabaseQueryAsync(string queryName, double durationMs)
    {
        var dimensions = new Dictionary<string, string> { { "QueryName", queryName } };
        await _metricsPublisher.PublishTimingAsync("DatabaseQueryDuration", durationMs, dimensions);
    }

    public async Task TrackExternalApiCallAsync(string apiName, double durationMs, bool success)
    {
        var dimensions = new Dictionary<string, string>
        {
            { "ApiName", apiName },
            { "Success", success.ToString() }
        };
        await _metricsPublisher.PublishTimingAsync("ExternalApiCallDuration", durationMs, dimensions);
        await _metricsPublisher.PublishCounterAsync("ExternalApiCall", 1, dimensions);
    }

    public async Task TrackCacheHitAsync(string cacheKey)
    {
        var dimensions = new Dictionary<string, string> { { "CacheKey", cacheKey } };
        await _metricsPublisher.PublishCounterAsync("CacheHit", 1, dimensions);
    }

    public async Task TrackCacheMissAsync(string cacheKey)
    {
        var dimensions = new Dictionary<string, string> { { "CacheKey", cacheKey } };
        await _metricsPublisher.PublishCounterAsync("CacheMiss", 1, dimensions);
    }
}
