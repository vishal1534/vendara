using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace RealServ.Shared.Observability.Extensions;

/// <summary>
/// Extension methods for ASP.NET Core controllers to simplify RBAC operations.
/// </summary>
public static class ControllerExtensions
{
    /// <summary>
    /// Gets the current authenticated user's ID from the JWT token.
    /// </summary>
    /// <param name="controller">The controller instance</param>
    /// <returns>The user ID as a Guid</returns>
    /// <exception cref="UnauthorizedAccessException">Thrown if user ID is not found in token</exception>
    /// <remarks>
    /// <para>
    /// Looks for the "sub" (subject) claim in the JWT token.
    /// This is the standard claim for user ID in OAuth 2.0/OpenID Connect.
    /// </para>
    /// <para>
    /// Usage:
    /// <code>
    /// var userId = this.GetCurrentUserId();
    /// </code>
    /// </para>
    /// </remarks>
    public static Guid GetCurrentUserId(this ControllerBase controller)
    {
        var userIdClaim = controller.User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                          ?? controller.User.FindFirst("sub")?.Value
                          ?? controller.User.FindFirst("userId")?.Value;
        
        if (string.IsNullOrEmpty(userIdClaim))
        {
            throw new UnauthorizedAccessException("User ID not found in token. Ensure the token contains 'sub', 'userId', or NameIdentifier claim.");
        }
        
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException($"User ID '{userIdClaim}' is not a valid GUID.");
        }
        
        return userId;
    }

    /// <summary>
    /// Checks if the current user is the owner of a resource.
    /// </summary>
    /// <param name="controller">The controller instance</param>
    /// <param name="resourceOwnerId">The ID of the resource owner</param>
    /// <returns>True if the current user owns the resource, false otherwise</returns>
    /// <remarks>
    /// <para>
    /// Usage:
    /// <code>
    /// if (!this.IsOwner(customerId))
    /// {
    ///     return Forbid(); // 403 Forbidden
    /// }
    /// </code>
    /// </para>
    /// </remarks>
    public static bool IsOwner(this ControllerBase controller, Guid resourceOwnerId)
    {
        try
        {
            var currentUserId = controller.GetCurrentUserId();
            return currentUserId == resourceOwnerId;
        }
        catch (UnauthorizedAccessException)
        {
            return false;
        }
    }

    /// <summary>
    /// Gets the current user's email from the JWT token.
    /// </summary>
    /// <param name="controller">The controller instance</param>
    /// <returns>The user's email address, or null if not found</returns>
    /// <remarks>
    /// <para>
    /// Looks for the "email" claim in the JWT token.
    /// </para>
    /// </remarks>
    public static string? GetCurrentUserEmail(this ControllerBase controller)
    {
        return controller.User.FindFirst(ClaimTypes.Email)?.Value
               ?? controller.User.FindFirst("email")?.Value;
    }

    /// <summary>
    /// Gets the current user's role from the JWT token.
    /// </summary>
    /// <param name="controller">The controller instance</param>
    /// <returns>The user's role, or null if not found</returns>
    /// <remarks>
    /// <para>
    /// Looks for the "role" claim in the JWT token.
    /// </para>
    /// </remarks>
    public static string? GetCurrentUserRole(this ControllerBase controller)
    {
        return controller.User.FindFirst(ClaimTypes.Role)?.Value
               ?? controller.User.FindFirst("role")?.Value;
    }

    /// <summary>
    /// Checks if the current user has a specific role.
    /// </summary>
    /// <param name="controller">The controller instance</param>
    /// <param name="role">The role to check for</param>
    /// <returns>True if the user has the role, false otherwise</returns>
    /// <remarks>
    /// <para>
    /// Case-insensitive role comparison.
    /// </para>
    /// <para>
    /// Usage:
    /// <code>
    /// if (this.HasRole("Admin"))
    /// {
    ///     // Admin-specific logic
    /// }
    /// </code>
    /// </para>
    /// </remarks>
    public static bool HasRole(this ControllerBase controller, string role)
    {
        var userRole = controller.GetCurrentUserRole();
        return !string.IsNullOrEmpty(userRole) && 
               userRole.Equals(role, StringComparison.OrdinalIgnoreCase);
    }

    /// <summary>
    /// Checks if the current user is an admin (SuperAdmin or Admin role).
    /// </summary>
    /// <param name="controller">The controller instance</param>
    /// <returns>True if the user is an admin, false otherwise</returns>
    public static bool IsAdmin(this ControllerBase controller)
    {
        return controller.HasRole("SuperAdmin") || controller.HasRole("Admin");
    }

    /// <summary>
    /// Enforces that the current user is the owner of a resource.
    /// Returns Forbid() if not the owner, otherwise returns null.
    /// </summary>
    /// <param name="controller">The controller instance</param>
    /// <param name="resourceOwnerId">The ID of the resource owner</param>
    /// <returns>ForbidResult if not owner, null if owner</returns>
    /// <remarks>
    /// <para>
    /// Simplifies ownership checks in controller methods.
    /// </para>
    /// <para>
    /// Usage:
    /// <code>
    /// var ownershipCheck = this.EnforceOwnership(customerId);
    /// if (ownershipCheck != null) return ownershipCheck; // Returns 403 if not owner
    /// 
    /// // Continue with owner-only logic
    /// </code>
    /// </para>
    /// </remarks>
    public static IActionResult? EnforceOwnership(this ControllerBase controller, Guid resourceOwnerId)
    {
        if (!controller.IsOwner(resourceOwnerId))
        {
            return controller.Forbid();
        }
        return null;
    }

    /// <summary>
    /// Enforces that the current user is the owner of a resource OR has admin permissions.
    /// Returns Forbid() if neither condition is met, otherwise returns null.
    /// </summary>
    /// <param name="controller">The controller instance</param>
    /// <param name="resourceOwnerId">The ID of the resource owner</param>
    /// <returns>ForbidResult if not owner and not admin, null otherwise</returns>
    /// <remarks>
    /// <para>
    /// Useful for endpoints that allow both owner access and admin override.
    /// </para>
    /// <para>
    /// Usage:
    /// <code>
    /// var authCheck = this.EnforceOwnershipOrAdmin(vendorId);
    /// if (authCheck != null) return authCheck; // Returns 403 if not owner and not admin
    /// 
    /// // Continue with logic
    /// </code>
    /// </para>
    /// </remarks>
    public static IActionResult? EnforceOwnershipOrAdmin(this ControllerBase controller, Guid resourceOwnerId)
    {
        if (!controller.IsOwner(resourceOwnerId) && !controller.IsAdmin())
        {
            return controller.Forbid();
        }
        return null;
    }

    /// <summary>
    /// Gets all claims from the current user's JWT token.
    /// Useful for debugging and understanding what's in the token.
    /// </summary>
    /// <param name="controller">The controller instance</param>
    /// <returns>Dictionary of claim types to claim values</returns>
    public static Dictionary<string, string> GetAllClaims(this ControllerBase controller)
    {
        return controller.User.Claims
            .GroupBy(c => c.Type)
            .ToDictionary(g => g.Key, g => string.Join(", ", g.Select(c => c.Value)));
    }
}
