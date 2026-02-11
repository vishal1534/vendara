using System.Text.Json;
using IntegrationService.Data;
using IntegrationService.Models.Entities;

namespace IntegrationService.Services;

/// <summary>
/// Service for logging audit events
/// </summary>
public interface IAuditService
{
    Task LogAsync(string action, string? userId = null, string? userType = null, 
        string? entityType = null, string? entityId = null, object? metadata = null,
        string? ipAddress = null, string? userAgent = null, string result = "Success", 
        string? errorMessage = null);
}

public class AuditService : IAuditService
{
    private readonly IntegrationDbContext _context;
    private readonly ILogger<AuditService> _logger;

    public AuditService(IntegrationDbContext context, ILogger<AuditService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task LogAsync(
        string action, 
        string? userId = null, 
        string? userType = null,
        string? entityType = null, 
        string? entityId = null, 
        object? metadata = null,
        string? ipAddress = null, 
        string? userAgent = null, 
        string result = "Success",
        string? errorMessage = null)
    {
        try
        {
            var auditLog = new AuditLog
            {
                Action = action,
                UserId = userId,
                UserType = userType,
                EntityType = entityType,
                EntityId = entityId,
                Metadata = metadata != null ? JsonSerializer.Serialize(metadata) : null,
                IpAddress = ipAddress,
                UserAgent = userAgent,
                Result = result,
                ErrorMessage = errorMessage
            };

            _context.AuditLogs.Add(auditLog);
            await _context.SaveChangesAsync();

            _logger.LogInformation(
                "Audit log created: Action={Action}, UserId={UserId}, EntityType={EntityType}, EntityId={EntityId}, Result={Result}",
                action, userId, entityType, entityId, result);
        }
        catch (Exception ex)
        {
            // Don't fail the main operation if audit logging fails
            _logger.LogError(ex, 
                "Failed to create audit log: Action={Action}, UserId={UserId}, EntityType={EntityType}, EntityId={EntityId}",
                action, userId, entityType, entityId);
        }
    }
}

/// <summary>
/// Extension methods for HttpContext to extract IP and User Agent
/// </summary>
public static class AuditServiceExtensions
{
    public static string? GetClientIpAddress(this HttpContext context)
    {
        // Try X-Forwarded-For header first (for proxies/load balancers)
        var forwardedFor = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
        if (!string.IsNullOrEmpty(forwardedFor))
        {
            // Take the first IP if multiple are present
            return forwardedFor.Split(',')[0].Trim();
        }

        // Try X-Real-IP header
        var realIp = context.Request.Headers["X-Real-IP"].FirstOrDefault();
        if (!string.IsNullOrEmpty(realIp))
        {
            return realIp;
        }

        // Fallback to RemoteIpAddress
        return context.Connection.RemoteIpAddress?.ToString();
    }

    public static string? GetUserAgent(this HttpContext context)
    {
        return context.Request.Headers["User-Agent"].FirstOrDefault();
    }
}
