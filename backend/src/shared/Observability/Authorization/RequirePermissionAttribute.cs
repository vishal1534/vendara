using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace RealServ.Shared.Observability.Authorization;

/// <summary>
/// Authorization attribute for permission-based access control.
/// Validates that the authenticated user has the required permission.
/// </summary>
/// <remarks>
/// <para>
/// Usage on controllers/actions:
/// <code>
/// [RequirePermission("orders:create")]
/// public async Task&lt;IActionResult&gt; CreateOrder(...)
/// 
/// [RequirePermission("payments:refund")]
/// public async Task&lt;IActionResult&gt; RefundPayment(...)
/// </code>
/// </para>
/// <para>
/// The attribute expects JWT claims to contain:
/// - "permissions" claim with comma-separated permission names
/// - OR call IdentityService to fetch user permissions
/// </para>
/// <para>
/// Configure in Program.cs:
/// <code>
/// builder.Services.AddSingleton&lt;IPermissionService, PermissionService&gt;();
/// </code>
/// </para>
/// </remarks>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
public class RequirePermissionAttribute : Attribute, IAsyncAuthorizationFilter
{
    private readonly string _permission;

    /// <summary>
    /// Creates a new instance of the RequirePermissionAttribute
    /// </summary>
    /// <param name="permission">The required permission (e.g., "orders:create", "payments:refund")</param>
    public RequirePermissionAttribute(string permission)
    {
        if (string.IsNullOrWhiteSpace(permission))
        {
            throw new ArgumentException("Permission cannot be null or empty", nameof(permission));
        }

        _permission = permission;
    }

    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var logger = context.HttpContext.RequestServices
            .GetService<ILogger<RequirePermissionAttribute>>();

        // Check if user is authenticated
        if (context.HttpContext.User?.Identity?.IsAuthenticated != true)
        {
            logger?.LogWarning(
                "Permission check failed: User not authenticated for permission {Permission}",
                _permission
            );

            context.Result = new UnauthorizedObjectResult(new
            {
                error = "Unauthorized",
                message = "Authentication required",
                statusCode = 401
            });
            return;
        }

        var userId = context.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ??
                     context.HttpContext.User.FindFirstValue("user_id") ??
                     context.HttpContext.User.FindFirstValue("sub");

        if (string.IsNullOrEmpty(userId))
        {
            logger?.LogWarning(
                "Permission check failed: User ID not found in claims for permission {Permission}",
                _permission
            );

            context.Result = new ForbiddenObjectResult(new
            {
                error = "Forbidden",
                message = "User ID not found",
                statusCode = 403
            });
            return;
        }

        // Try to get permissions from JWT claims first (faster)
        var hasPermission = CheckPermissionInClaims(context.HttpContext.User);

        if (!hasPermission)
        {
            // If not in claims, try to fetch from IdentityService
            var permissionService = context.HttpContext.RequestServices
                .GetService<IPermissionService>();

            if (permissionService != null)
            {
                hasPermission = await permissionService.UserHasPermissionAsync(userId, _permission);
            }
        }

        if (!hasPermission)
        {
            logger?.LogWarning(
                "Permission check failed: User {UserId} does not have permission {Permission}",
                userId,
                _permission
            );

            context.Result = new ForbiddenObjectResult(new
            {
                error = "Forbidden",
                message = $"Permission '{_permission}' required",
                statusCode = 403
            });
            return;
        }

        logger?.LogDebug(
            "Permission check passed: User {UserId} has permission {Permission}",
            userId,
            _permission
        );
    }

    private bool CheckPermissionInClaims(ClaimsPrincipal user)
    {
        // Check if permissions are in JWT claims (comma-separated)
        var permissionsClaim = user.FindFirstValue("permissions");
        
        if (string.IsNullOrEmpty(permissionsClaim))
        {
            return false;
        }

        var permissions = permissionsClaim.Split(',', StringSplitOptions.RemoveEmptyEntries)
            .Select(p => p.Trim())
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        return permissions.Contains(_permission);
    }
}

/// <summary>
/// Forbidden result (403) for permission-based authorization failures
/// </summary>
public class ForbiddenObjectResult : ObjectResult
{
    public ForbiddenObjectResult(object value) : base(value)
    {
        StatusCode = 403;
    }
}

/// <summary>
/// Interface for checking user permissions.
/// Implement this to call IdentityService for permission verification.
/// </summary>
public interface IPermissionService
{
    /// <summary>
    /// Checks if a user has a specific permission
    /// </summary>
    /// <param name="userId">The user ID</param>
    /// <param name="permission">The permission to check (e.g., "orders:create")</param>
    /// <returns>True if user has permission, false otherwise</returns>
    Task<bool> UserHasPermissionAsync(string userId, string permission);
}
