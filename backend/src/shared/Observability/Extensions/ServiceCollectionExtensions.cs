using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RealServ.Shared.Observability.Configuration;
using RealServ.Shared.Observability.Metrics;
using Serilog;

namespace RealServ.Shared.Observability.Extensions;

/// <summary>
/// Extension methods for configuring CloudWatch observability
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Adds CloudWatch logging and metrics to the service collection
    /// </summary>
    /// <param name="services">Service collection</param>
    /// <param name="configuration">Configuration</param>
    /// <param name="serviceName">Name of the service (e.g., "IdentityService")</param>
    public static IServiceCollection AddCloudWatchObservability(
        this IServiceCollection services,
        IConfiguration configuration,
        string serviceName)
    {
        // Bind CloudWatch configuration
        services.Configure<CloudWatchOptions>(
            configuration.GetSection(CloudWatchOptions.SectionName)
        );

        // Add metrics publisher
        services.AddSingleton<ICloudWatchMetricsPublisher>(provider =>
        {
            var options = Microsoft.Extensions.Options.Options.Create(
                configuration.GetSection(CloudWatchOptions.SectionName)
                    .Get<CloudWatchOptions>() ?? new CloudWatchOptions()
            );
            var logger = provider.GetRequiredService<Microsoft.Extensions.Logging.ILogger<CloudWatchMetricsPublisher>>();
            return new CloudWatchMetricsPublisher(options, logger, serviceName);
        });

        // Add health checks
        services.AddHealthChecks();

        return services;
    }

    /// <summary>
    /// Configures Serilog with CloudWatch integration
    /// </summary>
    public static void AddSerilogWithCloudWatch(
        this IServiceCollection services,
        IConfiguration configuration,
        string serviceName)
    {
        Log.Logger = Logging.CloudWatchLoggerConfiguration.CreateLogger(configuration, serviceName);
        services.AddSingleton(Log.Logger);
    }
}
