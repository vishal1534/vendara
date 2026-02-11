using System.Diagnostics;

namespace NotificationService.Middleware;

public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();
        var requestId = Guid.NewGuid().ToString();
        
        context.Items["RequestId"] = requestId;

        try
        {
            _logger.LogInformation(
                "Request Started: {RequestId} {Method} {Path}",
                requestId,
                context.Request.Method,
                context.Request.Path
            );

            await _next(context);

            stopwatch.Stop();
            
            _logger.LogInformation(
                "Request Completed: {RequestId} {Method} {Path} - Status: {StatusCode} - Duration: {Duration}ms",
                requestId,
                context.Request.Method,
                context.Request.Path,
                context.Response.StatusCode,
                stopwatch.ElapsedMilliseconds
            );
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            
            _logger.LogError(
                ex,
                "Request Failed: {RequestId} {Method} {Path} - Duration: {Duration}ms",
                requestId,
                context.Request.Method,
                context.Request.Path,
                stopwatch.ElapsedMilliseconds
            );
            
            throw;
        }
    }
}
