using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using IdentityService.Data;
using IdentityService.Models.Entities;
using IdentityService.Models.DTOs;
using RealServ.Shared.Domain.Enums;

namespace IdentityService.Services;

/// <summary>
/// Service for managing roles and permissions (RBAC)
/// Supports all 4 scenarios: Buyer, Vendor (Portal), Vendor (WhatsApp), Admin
/// </summary>
public interface IRoleService
{
    // Role management
    Task<RoleResponse> CreateRoleAsync(CreateRoleRequest request);
    Task<RoleResponse> GetRoleByIdAsync(Guid roleId);
    Task<RoleResponse> GetRoleByNameAsync(string roleName);
    Task<List<RoleResponse>> GetAllRolesAsync(UserType? userType = null);
    Task<RoleResponse> UpdateRoleAsync(Guid roleId, UpdateRoleRequest request);
    Task DeleteRoleAsync(Guid roleId);

    // Permission management
    Task<PermissionResponse> CreatePermissionAsync(CreatePermissionRequest request);
    Task<PermissionResponse> GetPermissionByIdAsync(Guid permissionId);
    Task<List<PermissionResponse>> GetAllPermissionsAsync(string? category = null);
    Task<PermissionResponse> UpdatePermissionAsync(Guid permissionId, UpdatePermissionRequest request);
    Task DeletePermissionAsync(Guid permissionId);

    // User role assignment
    Task AssignRolesToUserAsync(AssignRolesRequest request, Guid assignedBy);
    Task RemoveRolesFromUserAsync(RemoveRolesRequest request);
    Task<UserWithRolesResponse> GetUserWithRolesAsync(Guid userId);
    Task<UserPermissionsResponse> GetUserPermissionsAsync(Guid userId);
    Task<bool> UserHasPermissionAsync(Guid userId, string permissionName);
    Task<bool> UserHasRoleAsync(Guid userId, string roleName);
}

public class RoleService : IRoleService
{
    private readonly IdentityServiceDbContext _dbContext;
    private readonly ILogger<RoleService> _logger;

    public RoleService(
        IdentityServiceDbContext dbContext,
        ILogger<RoleService> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    // ============================================================================
    // ROLE MANAGEMENT
    // ============================================================================

    public async Task<RoleResponse> CreateRoleAsync(CreateRoleRequest request)
    {
        // Check if role already exists
        var existingRole = await _dbContext.Roles
            .FirstOrDefaultAsync(r => r.Name == request.Name && !r.IsDeleted);

        if (existingRole != null)
            throw new InvalidOperationException($"Role '{request.Name}' already exists");

        var role = new Role
        {
            Name = request.Name,
            DisplayName = request.DisplayName,
            Description = request.Description,
            UserType = request.UserType,
            IsActive = true,
            IsSystemRole = false
        };

        await _dbContext.Roles.AddAsync(role);
        await _dbContext.SaveChangesAsync();

        // Assign permissions
        if (request.PermissionIds.Any())
        {
            foreach (var permissionId in request.PermissionIds)
            {
                var rolePermission = new RolePermission
                {
                    RoleId = role.Id,
                    PermissionId = permissionId
                };
                await _dbContext.RolePermissions.AddAsync(rolePermission);
            }
            await _dbContext.SaveChangesAsync();
        }

        _logger.LogInformation("Role created: {RoleName} for UserType: {UserType}", role.Name, role.UserType);

        return await GetRoleByIdAsync(role.Id);
    }

    public async Task<RoleResponse> GetRoleByIdAsync(Guid roleId)
    {
        var role = await _dbContext.Roles
            .Include(r => r.RolePermissions)
                .ThenInclude(rp => rp.Permission)
            .FirstOrDefaultAsync(r => r.Id == roleId && !r.IsDeleted);

        if (role == null)
            throw new KeyNotFoundException($"Role with ID {roleId} not found");

        return MapToRoleResponse(role);
    }

    public async Task<RoleResponse> GetRoleByNameAsync(string roleName)
    {
        var role = await _dbContext.Roles
            .Include(r => r.RolePermissions)
                .ThenInclude(rp => rp.Permission)
            .FirstOrDefaultAsync(r => r.Name == roleName && !r.IsDeleted);

        if (role == null)
            throw new KeyNotFoundException($"Role '{roleName}' not found");

        return MapToRoleResponse(role);
    }

    public async Task<List<RoleResponse>> GetAllRolesAsync(UserType? userType = null)
    {
        var query = _dbContext.Roles
            .Include(r => r.RolePermissions)
                .ThenInclude(rp => rp.Permission)
            .Where(r => !r.IsDeleted);

        if (userType.HasValue)
            query = query.Where(r => r.UserType == userType.Value);

        var roles = await query
            .OrderBy(r => r.UserType)
            .ThenBy(r => r.Name)
            .ToListAsync();

        return roles.Select(MapToRoleResponse).ToList();
    }

    public async Task<RoleResponse> UpdateRoleAsync(Guid roleId, UpdateRoleRequest request)
    {
        var role = await _dbContext.Roles
            .Include(r => r.RolePermissions)
            .FirstOrDefaultAsync(r => r.Id == roleId && !r.IsDeleted);

        if (role == null)
            throw new KeyNotFoundException($"Role with ID {roleId} not found");

        if (role.IsSystemRole && request.PermissionIds != null)
            throw new InvalidOperationException("Cannot modify permissions of system roles");

        if (request.DisplayName != null) role.DisplayName = request.DisplayName;
        if (request.Description != null) role.Description = request.Description;
        if (request.IsActive.HasValue) role.IsActive = request.IsActive.Value;

        // Update permissions if provided
        if (request.PermissionIds != null)
        {
            // Remove existing permissions
            var existingPermissions = await _dbContext.RolePermissions
                .Where(rp => rp.RoleId == roleId)
                .ToListAsync();
            _dbContext.RolePermissions.RemoveRange(existingPermissions);

            // Add new permissions
            foreach (var permissionId in request.PermissionIds)
            {
                var rolePermission = new RolePermission
                {
                    RoleId = roleId,
                    PermissionId = permissionId
                };
                await _dbContext.RolePermissions.AddAsync(rolePermission);
            }
        }

        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Role updated: {RoleId}", roleId);

        return await GetRoleByIdAsync(roleId);
    }

    public async Task DeleteRoleAsync(Guid roleId)
    {
        var role = await _dbContext.Roles
            .FirstOrDefaultAsync(r => r.Id == roleId && !r.IsDeleted);

        if (role == null)
            throw new KeyNotFoundException($"Role with ID {roleId} not found");

        if (role.IsSystemRole)
            throw new InvalidOperationException("Cannot delete system roles");

        // Check if role is assigned to any users
        var userCount = await _dbContext.UserRoles
            .CountAsync(ur => ur.RoleId == roleId && !ur.IsDeleted);

        if (userCount > 0)
            throw new InvalidOperationException($"Cannot delete role. It is assigned to {userCount} user(s)");

        role.IsDeleted = true;
        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Role deleted: {RoleId}", roleId);
    }

    // ============================================================================
    // PERMISSION MANAGEMENT
    // ============================================================================

    public async Task<PermissionResponse> CreatePermissionAsync(CreatePermissionRequest request)
    {
        var existingPermission = await _dbContext.Permissions
            .FirstOrDefaultAsync(p => p.Name == request.Name && !p.IsDeleted);

        if (existingPermission != null)
            throw new InvalidOperationException($"Permission '{request.Name}' already exists");

        var permission = new Permission
        {
            Name = request.Name,
            DisplayName = request.DisplayName,
            Description = request.Description,
            Category = request.Category,
            IsActive = true
        };

        await _dbContext.Permissions.AddAsync(permission);
        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Permission created: {PermissionName}", permission.Name);

        return MapToPermissionResponse(permission);
    }

    public async Task<PermissionResponse> GetPermissionByIdAsync(Guid permissionId)
    {
        var permission = await _dbContext.Permissions
            .FirstOrDefaultAsync(p => p.Id == permissionId && !p.IsDeleted);

        if (permission == null)
            throw new KeyNotFoundException($"Permission with ID {permissionId} not found");

        return MapToPermissionResponse(permission);
    }

    public async Task<List<PermissionResponse>> GetAllPermissionsAsync(string? category = null)
    {
        var query = _dbContext.Permissions.Where(p => !p.IsDeleted);

        if (!string.IsNullOrEmpty(category))
            query = query.Where(p => p.Category == category);

        var permissions = await query
            .OrderBy(p => p.Category)
            .ThenBy(p => p.Name)
            .ToListAsync();

        return permissions.Select(MapToPermissionResponse).ToList();
    }

    public async Task<PermissionResponse> UpdatePermissionAsync(Guid permissionId, UpdatePermissionRequest request)
    {
        var permission = await _dbContext.Permissions
            .FirstOrDefaultAsync(p => p.Id == permissionId && !p.IsDeleted);

        if (permission == null)
            throw new KeyNotFoundException($"Permission with ID {permissionId} not found");

        if (request.DisplayName != null) permission.DisplayName = request.DisplayName;
        if (request.Description != null) permission.Description = request.Description;
        if (request.Category != null) permission.Category = request.Category;
        if (request.IsActive.HasValue) permission.IsActive = request.IsActive.Value;

        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Permission updated: {PermissionId}", permissionId);

        return MapToPermissionResponse(permission);
    }

    public async Task DeletePermissionAsync(Guid permissionId)
    {
        var permission = await _dbContext.Permissions
            .FirstOrDefaultAsync(p => p.Id == permissionId && !p.IsDeleted);

        if (permission == null)
            throw new KeyNotFoundException($"Permission with ID {permissionId} not found");

        // Check if permission is assigned to any roles
        var roleCount = await _dbContext.RolePermissions
            .CountAsync(rp => rp.PermissionId == permissionId && !rp.IsDeleted);

        if (roleCount > 0)
            throw new InvalidOperationException($"Cannot delete permission. It is assigned to {roleCount} role(s)");

        permission.IsDeleted = true;
        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Permission deleted: {PermissionId}", permissionId);
    }

    // ============================================================================
    // USER ROLE ASSIGNMENT
    // ============================================================================

    public async Task AssignRolesToUserAsync(AssignRolesRequest request, Guid assignedBy)
    {
        var user = await _dbContext.Users
            .Include(u => u.UserRoles)
            .FirstOrDefaultAsync(u => u.Id == request.UserId && !u.IsDeleted);

        if (user == null)
            throw new KeyNotFoundException($"User with ID {request.UserId} not found");

        foreach (var roleId in request.RoleIds)
        {
            // Check if role exists
            var role = await _dbContext.Roles
                .FirstOrDefaultAsync(r => r.Id == roleId && !r.IsDeleted);

            if (role == null)
            {
                _logger.LogWarning("Role {RoleId} not found, skipping", roleId);
                continue;
            }

            // Validate role matches user type
            if (role.UserType != user.UserType)
            {
                _logger.LogWarning("Role {RoleName} (UserType: {RoleUserType}) cannot be assigned to user {UserId} (UserType: {UserUserType})",
                    role.Name, role.UserType, user.Id, user.UserType);
                throw new InvalidOperationException($"Role '{role.Name}' is for {role.UserType} users only");
            }

            // Check if already assigned
            var existingUserRole = await _dbContext.UserRoles
                .FirstOrDefaultAsync(ur => ur.UserId == request.UserId && ur.RoleId == roleId && !ur.IsDeleted);

            if (existingUserRole != null)
            {
                _logger.LogInformation("Role {RoleId} already assigned to user {UserId}", roleId, request.UserId);
                continue;
            }

            var userRole = new UserRole
            {
                UserId = request.UserId,
                RoleId = roleId,
                AssignedAt = DateTime.UtcNow,
                AssignedBy = assignedBy
            };

            await _dbContext.UserRoles.AddAsync(userRole);
        }

        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Roles assigned to user {UserId}", request.UserId);
    }

    public async Task RemoveRolesFromUserAsync(RemoveRolesRequest request)
    {
        var userRoles = await _dbContext.UserRoles
            .Where(ur => ur.UserId == request.UserId && request.RoleIds.Contains(ur.RoleId) && !ur.IsDeleted)
            .ToListAsync();

        if (!userRoles.Any())
        {
            _logger.LogWarning("No roles found to remove for user {UserId}", request.UserId);
            return;
        }

        foreach (var userRole in userRoles)
        {
            userRole.IsDeleted = true;
        }

        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Roles removed from user {UserId}", request.UserId);
    }

    public async Task<UserWithRolesResponse> GetUserWithRolesAsync(Guid userId)
    {
        var user = await _dbContext.Users
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                    .ThenInclude(r => r.RolePermissions)
                        .ThenInclude(rp => rp.Permission)
            .FirstOrDefaultAsync(u => u.Id == userId && !u.IsDeleted);

        if (user == null)
            throw new KeyNotFoundException($"User with ID {userId} not found");

        var roles = user.UserRoles
            .Where(ur => !ur.IsDeleted && !ur.Role.IsDeleted)
            .Select(ur => MapToRoleResponse(ur.Role))
            .ToList();

        var allPermissions = user.UserRoles
            .Where(ur => !ur.IsDeleted && !ur.Role.IsDeleted)
            .SelectMany(ur => ur.Role.RolePermissions)
            .Where(rp => !rp.IsDeleted && !rp.Permission.IsDeleted && rp.Permission.IsActive)
            .Select(rp => rp.Permission.Name)
            .Distinct()
            .ToList();

        return new UserWithRolesResponse
        {
            Id = user.Id,
            FirebaseUid = user.FirebaseUid,
            PhoneNumber = user.PhoneNumber,
            Email = user.Email,
            FullName = user.FullName,
            UserType = user.UserType,
            Status = user.Status,
            Roles = roles,
            AllPermissions = allPermissions,
            CreatedAt = user.CreatedAt
        };
    }

    public async Task<UserPermissionsResponse> GetUserPermissionsAsync(Guid userId)
    {
        var userWithRoles = await GetUserWithRolesAsync(userId);

        return new UserPermissionsResponse
        {
            UserId = userId,
            Permissions = userWithRoles.AllPermissions,
            Roles = userWithRoles.Roles
        };
    }

    public async Task<bool> UserHasPermissionAsync(Guid userId, string permissionName)
    {
        var hasPermission = await _dbContext.UserRoles
            .Where(ur => ur.UserId == userId && !ur.IsDeleted)
            .Include(ur => ur.Role)
                .ThenInclude(r => r.RolePermissions)
                    .ThenInclude(rp => rp.Permission)
            .AnyAsync(ur => ur.Role.RolePermissions
                .Any(rp => rp.Permission.Name == permissionName && !rp.IsDeleted && !rp.Permission.IsDeleted && rp.Permission.IsActive));

        return hasPermission;
    }

    public async Task<bool> UserHasRoleAsync(Guid userId, string roleName)
    {
        var hasRole = await _dbContext.UserRoles
            .Include(ur => ur.Role)
            .AnyAsync(ur => ur.UserId == userId && ur.Role.Name == roleName && !ur.IsDeleted && !ur.Role.IsDeleted);

        return hasRole;
    }

    // ============================================================================
    // HELPER METHODS
    // ============================================================================

    private RoleResponse MapToRoleResponse(Role role)
    {
        return new RoleResponse
        {
            Id = role.Id,
            Name = role.Name,
            DisplayName = role.DisplayName,
            Description = role.Description,
            UserType = role.UserType,
            IsActive = role.IsActive,
            IsSystemRole = role.IsSystemRole,
            Permissions = role.RolePermissions
                .Where(rp => !rp.IsDeleted && !rp.Permission.IsDeleted)
                .Select(rp => MapToPermissionResponse(rp.Permission))
                .ToList(),
            CreatedAt = role.CreatedAt
        };
    }

    private PermissionResponse MapToPermissionResponse(Permission permission)
    {
        return new PermissionResponse
        {
            Id = permission.Id,
            Name = permission.Name,
            DisplayName = permission.DisplayName,
            Description = permission.Description,
            Category = permission.Category,
            IsActive = permission.IsActive,
            CreatedAt = permission.CreatedAt
        };
    }
}
