using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using RealServ.Shared.Application.Models;
using System.Net;

namespace CatalogService.Middleware;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;
    private readonly IHostEnvironment _environment;

    public GlobalExceptionHandler(
        ILogger<GlobalExceptionHandler> _logger,
        IHostEnvironment environment)
    {
        this._logger = _logger;
        _environment = environment;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        _logger.LogError(exception, "An unhandled exception occurred: {Message}", exception.Message);

        var (statusCode, message) = exception switch
        {
            ArgumentNullException => (HttpStatusCode.BadRequest, "Required parameter is missing"),
            ArgumentException => (HttpStatusCode.BadRequest, exception.Message),
            KeyNotFoundException => (HttpStatusCode.NotFound, "Resource not found"),
            UnauthorizedAccessException => (HttpStatusCode.Unauthorized, "Unauthorized access"),
            DbUpdateException => (HttpStatusCode.Conflict, "Database update conflict occurred"),
            InvalidOperationException => (HttpStatusCode.BadRequest, "Invalid operation"),
            _ => (HttpStatusCode.InternalServerError, "An unexpected error occurred")
        };

        var response = new ApiResponse<object>
        {
            Success = false,
            Message = message,
            Errors = _environment.IsDevelopment()
                ? new List<string> { exception.Message, exception.StackTrace ?? string.Empty }
                : null
        };

        httpContext.Response.StatusCode = (int)statusCode;
        httpContext.Response.ContentType = "application/json";

        await httpContext.Response.WriteAsJsonAsync(response, cancellationToken);

        return true;
    }
}
