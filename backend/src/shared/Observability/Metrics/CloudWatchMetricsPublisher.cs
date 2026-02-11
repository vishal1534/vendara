using Amazon.CloudWatch;
using Amazon.CloudWatch.Model;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RealServ.Shared.Observability.Configuration;

namespace RealServ.Shared.Observability.Metrics;

/// <summary>
/// Publishes custom metrics to AWS CloudWatch
/// </summary>
public interface ICloudWatchMetricsPublisher
{
    /// <summary>
    /// Publish a counter metric (e.g., API call count)
    /// </summary>
    Task PublishCounterAsync(string metricName, double value, Dictionary<string, string>? dimensions = null);

    /// <summary>
    /// Publish a gauge metric (e.g., active connections)
    /// </summary>
    Task PublishGaugeAsync(string metricName, double value, Dictionary<string, string>? dimensions = null);

    /// <summary>
    /// Publish a timing metric (e.g., request duration in milliseconds)
    /// </summary>
    Task PublishTimingAsync(string metricName, double milliseconds, Dictionary<string, string>? dimensions = null);

    /// <summary>
    /// Publish multiple metrics in a batch
    /// </summary>
    Task PublishBatchAsync(IEnumerable<MetricDatum> metrics);
}

public class CloudWatchMetricsPublisher : ICloudWatchMetricsPublisher
{
    private readonly IAmazonCloudWatch _cloudWatchClient;
    private readonly CloudWatchOptions _options;
    private readonly ILogger<CloudWatchMetricsPublisher> _logger;
    private readonly string _serviceName;

    public CloudWatchMetricsPublisher(
        IOptions<CloudWatchOptions> options,
        ILogger<CloudWatchMetricsPublisher> logger,
        string serviceName)
    {
        _options = options.Value;
        _logger = logger;
        _serviceName = serviceName;

        // Initialize CloudWatch client
        var config = new AmazonCloudWatchConfig
        {
            RegionEndpoint = Amazon.RegionEndpoint.GetBySystemName(_options.Region)
        };

        _cloudWatchClient = new AmazonCloudWatchClient(config);
    }

    public async Task PublishCounterAsync(string metricName, double value, Dictionary<string, string>? dimensions = null)
    {
        if (!_options.EnableMetrics) return;

        var metric = CreateMetricDatum(metricName, value, StandardUnit.Count, dimensions);
        await PublishMetricAsync(metric);
    }

    public async Task PublishGaugeAsync(string metricName, double value, Dictionary<string, string>? dimensions = null)
    {
        if (!_options.EnableMetrics) return;

        var metric = CreateMetricDatum(metricName, value, StandardUnit.None, dimensions);
        await PublishMetricAsync(metric);
    }

    public async Task PublishTimingAsync(string metricName, double milliseconds, Dictionary<string, string>? dimensions = null)
    {
        if (!_options.EnableMetrics) return;

        var metric = CreateMetricDatum(metricName, milliseconds, StandardUnit.Milliseconds, dimensions);
        await PublishMetricAsync(metric);
    }

    public async Task PublishBatchAsync(IEnumerable<MetricDatum> metrics)
    {
        if (!_options.EnableMetrics) return;

        try
        {
            var request = new PutMetricDataRequest
            {
                Namespace = $"{_options.MetricsNamespace}/{_serviceName}",
                MetricData = metrics.ToList()
            };

            await _cloudWatchClient.PutMetricDataAsync(request);
            _logger.LogDebug("Published {Count} metrics to CloudWatch", metrics.Count());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to publish batch metrics to CloudWatch");
        }
    }

    private MetricDatum CreateMetricDatum(
        string metricName,
        double value,
        StandardUnit unit,
        Dictionary<string, string>? dimensions = null)
    {
        var metric = new MetricDatum
        {
            MetricName = metricName,
            Value = value,
            Unit = unit,
            TimestampUtc = DateTime.UtcNow,
            Dimensions = new List<Dimension>
            {
                new() { Name = "ServiceName", Value = _serviceName }
            }
        };

        // Add custom dimensions
        if (dimensions != null)
        {
            foreach (var (key, dimensionValue) in dimensions)
            {
                metric.Dimensions.Add(new Dimension { Name = key, Value = dimensionValue });
            }
        }

        return metric;
    }

    private async Task PublishMetricAsync(MetricDatum metric)
    {
        try
        {
            var request = new PutMetricDataRequest
            {
                Namespace = $"{_options.MetricsNamespace}/{_serviceName}",
                MetricData = new List<MetricDatum> { metric }
            };

            await _cloudWatchClient.PutMetricDataAsync(request);
            _logger.LogDebug("Published metric {MetricName} = {Value} to CloudWatch", metric.MetricName, metric.Value);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to publish metric {MetricName} to CloudWatch", metric.MetricName);
        }
    }
}
