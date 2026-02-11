using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using RealServ.Shared.Observability.Metrics;
using System.Diagnostics;

namespace RealServ.Shared.Observability.Middleware;

/// <summary>
/// Middleware for logging HTTP requests and publishing metrics to CloudWatch
/// </summary>
public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, ICloudWatchMetricsPublisher metricsPublisher)
    {
        var stopwatch = Stopwatch.StartNew();
        var requestPath = context.Request.Path.Value ?? "/";
        var requestMethod = context.Request.Method;

        try
        {
            // Log request start
            _logger.LogInformation(
                "HTTP {Method} {Path} started from {IP}",
                requestMethod,
                requestPath,
                context.Connection.RemoteIpAddress
            );

            await _next(context);

            stopwatch.Stop();
            var statusCode = context.Response.StatusCode;
            var duration = stopwatch.ElapsedMilliseconds;

            // Log request completion
            _logger.LogInformation(
                "HTTP {Method} {Path} completed with {StatusCode} in {Duration}ms",
                requestMethod,
                requestPath,
                statusCode,
                duration
            );

            // Publish metrics to CloudWatch
            var dimensions = new Dictionary<string, string>
            {
                { "Endpoint", requestPath },
                { "Method", requestMethod },
                { "StatusCode", statusCode.ToString() }
            };

            await metricsPublisher.PublishTimingAsync("ApiRequestDuration", duration, dimensions);
            await metricsPublisher.PublishCounterAsync("ApiRequestCount", 1, dimensions);

            // Track errors
            if (statusCode >= 400)
            {
                await metricsPublisher.PublishCounterAsync("ApiErrorCount", 1, dimensions);
            }
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            var duration = stopwatch.ElapsedMilliseconds;

            _logger.LogError(
                ex,
                "HTTP {Method} {Path} failed after {Duration}ms",
                requestMethod,
                requestPath,
                duration
            );

            // Publish error metrics
            var errorDimensions = new Dictionary<string, string>
            {
                { "Endpoint", requestPath },
                { "Method", requestMethod },
                { "ExceptionType", ex.GetType().Name }
            };

            await metricsPublisher.PublishCounterAsync("ApiExceptionCount", 1, errorDimensions);
            await metricsPublisher.PublishTimingAsync("ApiRequestDuration", duration, errorDimensions);

            throw;
        }
    }
}
