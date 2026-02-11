using AWS.Logger;
using AWS.Logger.SeriLog;
using Microsoft.Extensions.Configuration;
using RealServ.Shared.Observability.Configuration;
using Serilog;
using Serilog.Events;
using Serilog.Formatting.Compact;

namespace RealServ.Shared.Observability.Logging;

/// <summary>
/// Configures Serilog with CloudWatch integration
/// </summary>
public static class CloudWatchLoggerConfiguration
{
    /// <summary>
    /// Creates a Serilog Logger with CloudWatch sink
    /// </summary>
    public static ILogger CreateLogger(IConfiguration configuration, string serviceName)
    {
        var cloudWatchOptions = configuration
            .GetSection(CloudWatchOptions.SectionName)
            .Get<CloudWatchOptions>() ?? new CloudWatchOptions();

        var environment = configuration["ASPNETCORE_ENVIRONMENT"] ?? "Development";
        var isProduction = environment.Equals("Production", StringComparison.OrdinalIgnoreCase);

        var loggerConfiguration = new LoggerConfiguration()
            .MinimumLevel.Information()
            .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
            .MinimumLevel.Override("Microsoft.Hosting.Lifetime", LogEventLevel.Information)
            .MinimumLevel.Override("System", LogEventLevel.Warning)
            .Enrich.FromLogContext()
            .Enrich.WithProperty("ServiceName", serviceName)
            .Enrich.WithProperty("Environment", environment)
            .Enrich.WithMachineName()
            .Enrich.WithThreadId()
            .Enrich.WithProcessId();

        // Console logging (always enabled for development)
        if (!isProduction)
        {
            loggerConfiguration.WriteTo.Console(
                outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {SourceContext} {Message:lj}{NewLine}{Exception}"
            );
        }
        else
        {
            // Use compact JSON format in production
            loggerConfiguration.WriteTo.Console(new CompactJsonFormatter());
        }

        // CloudWatch logging (production and staging)
        if (cloudWatchOptions.EnableCloudWatch)
        {
            var logGroupName = !string.IsNullOrEmpty(cloudWatchOptions.LogGroupName)
                ? cloudWatchOptions.LogGroupName
                : $"/realserv/{serviceName.ToLower()}";

            var logStreamPrefix = !string.IsNullOrEmpty(cloudWatchOptions.LogStreamPrefix)
                ? cloudWatchOptions.LogStreamPrefix
                : serviceName;

            var awsLoggerConfig = new AWSLoggerConfig(logGroupName)
            {
                Region = cloudWatchOptions.Region,
                BatchSizeInBytes = 256_000, // 256 KB (max is 1 MB)
                BatchPushInterval = TimeSpan.FromSeconds(cloudWatchOptions.Period),
                MaxQueuedMessages = cloudWatchOptions.BatchSizeLimit,
                LogStreamNameSuffix = $"{logStreamPrefix}-{DateTime.UtcNow:yyyy-MM-dd-HH-mm-ss}"
            };

            // Set credentials if provided (use IAM roles in production)
            if (!string.IsNullOrEmpty(cloudWatchOptions.AccessKeyId))
            {
                Environment.SetEnvironmentVariable("AWS_ACCESS_KEY_ID", cloudWatchOptions.AccessKeyId);
                Environment.SetEnvironmentVariable("AWS_SECRET_ACCESS_KEY", cloudWatchOptions.SecretAccessKey);
                Environment.SetEnvironmentVariable("AWS_REGION", cloudWatchOptions.Region);
            }

            loggerConfiguration.WriteTo.AWSSeriLog(
                awsLoggerConfig,
                restrictedToMinimumLevel: Enum.Parse<LogEventLevel>(cloudWatchOptions.MinimumLevel)
            );
        }

        return loggerConfiguration.CreateLogger();
    }
}
