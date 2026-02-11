using RealServ.Shared.Domain.Enums;

namespace IdentityService.Models.DTOs;

// ============================================================================
// ROLE DTOs
// ============================================================================

/// <summary>
/// Response DTO for role information
/// </summary>
public class RoleResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public UserType UserType { get; set; }
    public bool IsActive { get; set; }
    public bool IsSystemRole { get; set; }
    public List<PermissionResponse> Permissions { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// Request to create a new role
/// </summary>
public class CreateRoleRequest
{
    public string Name { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public UserType UserType { get; set; }
    public List<Guid> PermissionIds { get; set; } = new();
}

/// <summary>
/// Request to update a role
/// </summary>
public class UpdateRoleRequest
{
    public string? DisplayName { get; set; }
    public string? Description { get; set; }
    public bool? IsActive { get; set; }
    public List<Guid>? PermissionIds { get; set; }
}

// ============================================================================
// PERMISSION DTOs
// ============================================================================

/// <summary>
/// Response DTO for permission information
/// </summary>
public class PermissionResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Category { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// Request to create a new permission
/// </summary>
public class CreatePermissionRequest
{
    public string Name { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Category { get; set; } = string.Empty;
}

/// <summary>
/// Request to update a permission
/// </summary>
public class UpdatePermissionRequest
{
    public string? DisplayName { get; set; }
    public string? Description { get; set; }
    public string? Category { get; set; }
    public bool? IsActive { get; set; }
}

// ============================================================================
// USER ROLE ASSIGNMENT DTOs
// ============================================================================

/// <summary>
/// Request to assign role(s) to a user
/// </summary>
public class AssignRolesRequest
{
    public Guid UserId { get; set; }
    public List<Guid> RoleIds { get; set; } = new();
}

/// <summary>
/// Request to remove role(s) from a user
/// </summary>
public class RemoveRolesRequest
{
    public Guid UserId { get; set; }
    public List<Guid> RoleIds { get; set; } = new();
}

/// <summary>
/// Response DTO for user with roles
/// </summary>
public class UserWithRolesResponse
{
    public Guid Id { get; set; }
    public string FirebaseUid { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? FullName { get; set; }
    public UserType UserType { get; set; }
    public UserStatus Status { get; set; }
    public List<RoleResponse> Roles { get; set; } = new();
    public List<string> AllPermissions { get; set; } = new(); // Flattened list of all permissions from all roles
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// Response DTO for checking user permissions
/// </summary>
public class UserPermissionsResponse
{
    public Guid UserId { get; set; }
    public List<string> Permissions { get; set; } = new();
    public List<RoleResponse> Roles { get; set; } = new();
}
