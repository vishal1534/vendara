using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IdentityService.Data;
using FirebaseAdmin.Auth;

namespace IdentityService.Controllers;

/// <summary>
/// Health check endpoints for monitoring
/// </summary>
[ApiController]
[Route("api/v1")]
public class HealthController : ControllerBase
{
    private readonly IdentityServiceDbContext _context;
    private readonly ILogger<HealthController> _logger;

    public HealthController(IdentityServiceDbContext context, ILogger<HealthController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Basic health check
    /// </summary>
    [HttpGet("health")]
    [ProducesResponseType(typeof(HealthResponse), 200)]
    public async Task<ActionResult<HealthResponse>> Health()
    {
        var response = new HealthResponse
        {
            Status = "healthy",
            Service = "Identity Service",
            Version = "1.0.0",
            Timestamp = DateTime.UtcNow
        };

        // Check database connection
        try
        {
            await _context.Database.CanConnectAsync();
            response.Database = "connected";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Database health check failed");
            response.Database = "disconnected";
            response.Status = "unhealthy";
        }

        // Check Firebase connection
        try
        {
            // Simple check - if Firebase is initialized, it's healthy
            _ = FirebaseAuth.DefaultInstance;
            response.Firebase = "connected";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Firebase health check failed");
            response.Firebase = "disconnected";
            response.Status = "degraded";
        }

        var statusCode = response.Status == "healthy" ? 200 : 503;
        return StatusCode(statusCode, response);
    }

    /// <summary>
    /// Readiness check - is the service ready to accept requests?
    /// </summary>
    [HttpGet("ready")]
    [ProducesResponseType(typeof(ReadinessResponse), 200)]
    public async Task<ActionResult<ReadinessResponse>> Ready()
    {
        var response = new ReadinessResponse
        {
            Ready = true,
            Service = "Identity Service",
            Timestamp = DateTime.UtcNow
        };

        var checks = new List<string>();

        // Database must be ready
        try
        {
            await _context.Database.CanConnectAsync();
            checks.Add("database: ready");
        }
        catch
        {
            checks.Add("database: not ready");
            response.Ready = false;
        }

        // Firebase must be ready
        try
        {
            _ = FirebaseAuth.DefaultInstance;
            checks.Add("firebase: ready");
        }
        catch
        {
            checks.Add("firebase: not ready");
            response.Ready = false;
        }

        response.Checks = checks;

        var statusCode = response.Ready ? 200 : 503;
        return StatusCode(statusCode, response);
    }

    /// <summary>
    /// Detailed service information
    /// </summary>
    [HttpGet("info")]
    [ProducesResponseType(typeof(ServiceInfo), 200)]
    public ActionResult<ServiceInfo> Info()
    {
        var info = new ServiceInfo
        {
            Service = "RealServ Identity Service",
            Version = "1.0.0",
            Description = "Authentication and user management service",
            Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development",
            Timestamp = DateTime.UtcNow,
            Endpoints = new List<string>
            {
                "POST /api/v1/auth/signup",
                "POST /api/v1/auth/login",
                "POST /api/v1/auth/refresh",
                "POST /api/v1/auth/logout",
                "POST /api/v1/auth/forgot-password",
                "POST /api/v1/auth/reset-password",
                "POST /api/v1/auth/verify-email",
                "POST /api/v1/auth/resend-verification",
                "POST /api/v1/auth/google",
                "POST /api/v1/auth/apple",
                "POST /api/v1/auth/phone/send-otp",
                "POST /api/v1/auth/phone/verify-otp",
                "GET /api/v1/auth/me",
                "GET /api/v1/health",
                "GET /api/v1/ready",
                "GET /api/v1/info"
            }
        };

        return Ok(info);
    }
}

public class HealthResponse
{
    public string Status { get; set; } = "healthy";
    public string Service { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
    public string? Database { get; set; }
    public string? Firebase { get; set; }
    public DateTime Timestamp { get; set; }
}

public class ReadinessResponse
{
    public bool Ready { get; set; }
    public string Service { get; set; } = string.Empty;
    public List<string> Checks { get; set; } = new();
    public DateTime Timestamp { get; set; }
}

public class ServiceInfo
{
    public string Service { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Environment { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public List<string> Endpoints { get; set; } = new();
}
