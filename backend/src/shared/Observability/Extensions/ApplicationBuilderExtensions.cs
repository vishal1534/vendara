using Microsoft.AspNetCore.Builder;
using RealServ.Shared.Observability.Middleware;
using Serilog;

namespace RealServ.Shared.Observability.Extensions;

/// <summary>
/// Extension methods for configuring middleware pipeline
/// </summary>
public static class ApplicationBuilderExtensions
{
    /// <summary>
    /// Adds CloudWatch observability middleware to the pipeline
    /// </summary>
    public static IApplicationBuilder UseCloudWatchObservability(this IApplicationBuilder app)
    {
        // Use Serilog request logging
        app.UseSerilogRequestLogging(options =>
        {
            options.MessageTemplate = "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000}ms";
            options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
            {
                diagnosticContext.Set("RequestHost", httpContext.Request.Host.Value);
                diagnosticContext.Set("RequestScheme", httpContext.Request.Scheme);
                diagnosticContext.Set("UserAgent", httpContext.Request.Headers["User-Agent"].ToString());
                diagnosticContext.Set("ClientIP", httpContext.Connection.RemoteIpAddress?.ToString());
            };
        });

        // Add exception logging middleware
        app.UseMiddleware<ExceptionLoggingMiddleware>();

        // Add request logging and metrics middleware
        app.UseMiddleware<RequestLoggingMiddleware>();

        return app;
    }
}
