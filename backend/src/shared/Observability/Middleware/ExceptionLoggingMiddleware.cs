using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using RealServ.Shared.Models;
using System.Net;
using System.Text.Json;

namespace RealServ.Shared.Observability.Middleware;

/// <summary>
/// Global exception handling middleware with CloudWatch logging
/// </summary>
public class ExceptionLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionLoggingMiddleware> _logger;

    public ExceptionLoggingMiddleware(RequestDelegate next, ILogger<ExceptionLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var requestPath = context.Request.Path.Value ?? "/";
        var requestMethod = context.Request.Method;
        var correlationId = context.TraceIdentifier;

        // Log with structured data for CloudWatch Insights
        _logger.LogError(
            exception,
            "Unhandled exception in {Method} {Path}. CorrelationId: {CorrelationId}",
            requestMethod,
            requestPath,
            correlationId
        );

        // Determine status code and error message
        var (statusCode, message) = exception switch
        {
            KeyNotFoundException => (HttpStatusCode.NotFound, "Resource not found"),
            UnauthorizedAccessException => (HttpStatusCode.Unauthorized, "Unauthorized access"),
            ArgumentException => (HttpStatusCode.BadRequest, exception.Message),
            InvalidOperationException => (HttpStatusCode.BadRequest, exception.Message),
            _ => (HttpStatusCode.InternalServerError, "An internal server error occurred")
        };

        // Create error response
        var response = new ApiResponse<object>
        {
            Success = false,
            Message = message,
            Data = null,
            Errors = new List<string> { exception.Message },
            Timestamp = DateTime.UtcNow
        };

        // Add correlation ID for tracing
        response.Errors.Add($"CorrelationId: {correlationId}");

        // Write response
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(jsonResponse);
    }
}
