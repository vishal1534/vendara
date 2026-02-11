using RealServ.Shared.Domain.Entities;
using RealServ.Shared.Domain.Enums;

namespace IdentityService.Models.Entities;

/// <summary>
/// Role entity for RBAC
/// Supports dynamic role creation and management
/// </summary>
public class Role : AuditableEntity
{
    public string Name { get; set; } = string.Empty; // super_admin, operations, support, finance
    public string DisplayName { get; set; } = string.Empty; // Super Admin, Operations, Support
    public string? Description { get; set; }
    public UserType UserType { get; set; } // Admin, Vendor, Buyer
    public bool IsActive { get; set; } = true;
    public bool IsSystemRole { get; set; } = false; // Cannot be deleted if true

    // Navigation properties
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}

/// <summary>
/// Permission entity for RBAC
/// Granular permissions for all system features
/// </summary>
public class Permission : BaseEntity
{
    public string Name { get; set; } = string.Empty; // vendors.view, orders.update
    public string DisplayName { get; set; } = string.Empty; // View Vendors, Update Orders
    public string? Description { get; set; }
    public string Category { get; set; } = string.Empty; // vendors, orders, buyers, catalog, etc.
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}

/// <summary>
/// Junction table: Role to Permission mapping
/// Defines which permissions each role has
/// </summary>
public class RolePermission : BaseEntity
{
    public Guid RoleId { get; set; }
    public Guid PermissionId { get; set; }

    // Navigation properties
    public Role Role { get; set; } = null!;
    public Permission Permission { get; set; } = null!;
}

/// <summary>
/// Junction table: User to Role mapping
/// Supports multiple roles per user (1:N)
/// </summary>
public class UserRole : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid RoleId { get; set; }
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    public Guid? AssignedBy { get; set; } // Admin who assigned this role

    // Navigation properties
    public User User { get; set; } = null!;
    public Role Role { get; set; } = null!;
}
