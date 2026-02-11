using Microsoft.AspNetCore.Mvc;
using IdentityService.Models.DTOs;
using IdentityService.Services;
using RealServ.Shared.Domain.Enums;
using RealServ.Shared.Observability.Authorization;
using RealServ.Shared.Observability.Extensions;

namespace IdentityService.Controllers;

/// <summary>
/// RBAC Controller - Role and Permission Management
/// Supports all 4 scenarios: Buyer, Vendor (Portal), Vendor (WhatsApp), Admin
/// </summary>
[ApiController]
[Route("api/v1/roles")]
public class RolesController : ControllerBase
{
    private readonly IRoleService _roleService;
    private readonly ILogger<RolesController> _logger;

    public RolesController(
        IRoleService roleService,
        ILogger<RolesController> logger)
    {
        _roleService = roleService;
        _logger = logger;
    }

    // ============================================================================
    // ROLE MANAGEMENT
    // ============================================================================

    /// <summary>
    /// Get all roles
    /// </summary>
    /// <param name="userType">Optional filter by user type</param>
    [HttpGet]
    [RequirePermission("roles:read")]
    public async Task<ActionResult<List<RoleResponse>>> GetAllRoles([FromQuery] UserType? userType = null)
    {
        try
        {
            var roles = await _roleService.GetAllRolesAsync(userType);
            return Ok(roles);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting roles");
            return StatusCode(500, new { message = "Failed to retrieve roles" });
        }
    }

    /// <summary>
    /// Get role by ID
    /// </summary>
    [HttpGet("{roleId:guid}")]
    [RequirePermission("roles:read")]
    public async Task<ActionResult<RoleResponse>> GetRoleById(Guid roleId)
    {
        try
        {
            var role = await _roleService.GetRoleByIdAsync(roleId);
            return Ok(role);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting role {RoleId}", roleId);
            return StatusCode(500, new { message = "Failed to retrieve role" });
        }
    }

    /// <summary>
    /// Get role by name
    /// </summary>
    [HttpGet("by-name/{roleName}")]
    [RequirePermission("roles:read")]
    public async Task<ActionResult<RoleResponse>> GetRoleByName(string roleName)
    {
        try
        {
            var role = await _roleService.GetRoleByNameAsync(roleName);
            return Ok(role);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting role {RoleName}", roleName);
            return StatusCode(500, new { message = "Failed to retrieve role" });
        }
    }

    /// <summary>
    /// Create a new role
    /// </summary>
    [HttpPost]
    [RequirePermission("roles:create")]
    public async Task<ActionResult<RoleResponse>> CreateRole([FromBody] CreateRoleRequest request)
    {
        try
        {
            var role = await _roleService.CreateRoleAsync(request);
            return CreatedAtAction(nameof(GetRoleById), new { roleId = role.Id }, role);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating role");
            return StatusCode(500, new { message = "Failed to create role" });
        }
    }

    /// <summary>
    /// Update a role
    /// </summary>
    [HttpPut("{roleId:guid}")]
    [RequirePermission("roles:update")]
    public async Task<ActionResult<RoleResponse>> UpdateRole(Guid roleId, [FromBody] UpdateRoleRequest request)
    {
        try
        {
            var role = await _roleService.UpdateRoleAsync(roleId, request);
            return Ok(role);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating role {RoleId}", roleId);
            return StatusCode(500, new { message = "Failed to update role" });
        }
    }

    /// <summary>
    /// Delete a role
    /// </summary>
    [HttpDelete("{roleId:guid}")]
    [RequirePermission("roles:delete")]
    public async Task<ActionResult> DeleteRole(Guid roleId)
    {
        try
        {
            await _roleService.DeleteRoleAsync(roleId);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting role {RoleId}", roleId);
            return StatusCode(500, new { message = "Failed to delete role" });
        }
    }

    // ============================================================================
    // PERMISSION MANAGEMENT
    // ============================================================================

    /// <summary>
    /// Get all permissions
    /// </summary>
    /// <param name="category">Optional filter by category</param>
    [HttpGet("~/api/v1/permissions")]
    [RequirePermission("permissions:read")]
    public async Task<ActionResult<List<PermissionResponse>>> GetAllPermissions([FromQuery] string? category = null)
    {
        try
        {
            var permissions = await _roleService.GetAllPermissionsAsync(category);
            return Ok(permissions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting permissions");
            return StatusCode(500, new { message = "Failed to retrieve permissions" });
        }
    }

    /// <summary>
    /// Get permission by ID
    /// </summary>
    [HttpGet("~/api/v1/permissions/{permissionId:guid}")]
    [RequirePermission("permissions:read")]
    public async Task<ActionResult<PermissionResponse>> GetPermissionById(Guid permissionId)
    {
        try
        {
            var permission = await _roleService.GetPermissionByIdAsync(permissionId);
            return Ok(permission);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting permission {PermissionId}", permissionId);
            return StatusCode(500, new { message = "Failed to retrieve permission" });
        }
    }

    /// <summary>
    /// Create a new permission
    /// </summary>
    [HttpPost("~/api/v1/permissions")]
    [RequirePermission("permissions:create")]
    public async Task<ActionResult<PermissionResponse>> CreatePermission([FromBody] CreatePermissionRequest request)
    {
        try
        {
            var permission = await _roleService.CreatePermissionAsync(request);
            return CreatedAtAction(nameof(GetPermissionById), new { permissionId = permission.Id }, permission);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating permission");
            return StatusCode(500, new { message = "Failed to create permission" });
        }
    }

    /// <summary>
    /// Update a permission
    /// </summary>
    [HttpPut("~/api/v1/permissions/{permissionId:guid}")]
    [RequirePermission("permissions:update")]
    public async Task<ActionResult<PermissionResponse>> UpdatePermission(Guid permissionId, [FromBody] UpdatePermissionRequest request)
    {
        try
        {
            var permission = await _roleService.UpdatePermissionAsync(permissionId, request);
            return Ok(permission);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating permission {PermissionId}", permissionId);
            return StatusCode(500, new { message = "Failed to update permission" });
        }
    }

    /// <summary>
    /// Delete a permission
    /// </summary>
    [HttpDelete("~/api/v1/permissions/{permissionId:guid}")]
    [RequirePermission("permissions:delete")]
    public async Task<ActionResult> DeletePermission(Guid permissionId)
    {
        try
        {
            await _roleService.DeletePermissionAsync(permissionId);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting permission {PermissionId}", permissionId);
            return StatusCode(500, new { message = "Failed to delete permission" });
        }
    }

    // ============================================================================
    // USER ROLE ASSIGNMENT
    // ============================================================================

    /// <summary>
    /// Assign roles to a user
    /// </summary>
    [HttpPost("~/api/v1/users/{userId:guid}/roles")]
    [RequirePermission("users:assign-roles")]
    public async Task<ActionResult> AssignRoles(Guid userId, [FromBody] List<Guid> roleIds)
    {
        try
        {
            // TODO: Get current admin user ID from auth context
            var assignedBy = Guid.Empty; // Replace with actual admin user ID

            var request = new AssignRolesRequest
            {
                UserId = userId,
                RoleIds = roleIds
            };

            await _roleService.AssignRolesToUserAsync(request, assignedBy);
            return Ok(new { message = "Roles assigned successfully" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error assigning roles to user {UserId}", userId);
            return StatusCode(500, new { message = "Failed to assign roles" });
        }
    }

    /// <summary>
    /// Remove roles from a user
    /// </summary>
    [HttpDelete("~/api/v1/users/{userId:guid}/roles")]
    [RequirePermission("users:remove-roles")]
    public async Task<ActionResult> RemoveRoles(Guid userId, [FromBody] List<Guid> roleIds)
    {
        try
        {
            var request = new RemoveRolesRequest
            {
                UserId = userId,
                RoleIds = roleIds
            };

            await _roleService.RemoveRolesFromUserAsync(request);
            return Ok(new { message = "Roles removed successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing roles from user {UserId}", userId);
            return StatusCode(500, new { message = "Failed to remove roles" });
        }
    }

    /// <summary>
    /// Get user with all roles and permissions
    /// </summary>
    [HttpGet("~/api/v1/users/{userId:guid}/roles")]
    [RequirePermission("users:read")]
    public async Task<ActionResult<UserWithRolesResponse>> GetUserWithRoles(Guid userId)
    {
        try
        {
            var user = await _roleService.GetUserWithRolesAsync(userId);
            return Ok(user);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user roles {UserId}", userId);
            return StatusCode(500, new { message = "Failed to retrieve user roles" });
        }
    }

    /// <summary>
    /// Get user permissions
    /// </summary>
    [HttpGet("~/api/v1/users/{userId:guid}/permissions")]
    [RequirePermission("users:read")]
    public async Task<ActionResult<UserPermissionsResponse>> GetUserPermissions(Guid userId)
    {
        try
        {
            var permissions = await _roleService.GetUserPermissionsAsync(userId);
            return Ok(permissions);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user permissions {UserId}", userId);
            return StatusCode(500, new { message = "Failed to retrieve user permissions" });
        }
    }

    /// <summary>
    /// Check if user has a specific permission
    /// </summary>
    [HttpGet("~/api/v1/users/{userId:guid}/permissions/{permissionName}/check")]
    [RequirePermission("users:read")]
    public async Task<ActionResult<bool>> CheckUserPermission(Guid userId, string permissionName)
    {
        try
        {
            var hasPermission = await _roleService.UserHasPermissionAsync(userId, permissionName);
            return Ok(new { hasPermission });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking user permission {UserId} - {Permission}", userId, permissionName);
            return StatusCode(500, new { message = "Failed to check permission" });
        }
    }

    /// <summary>
    /// Check if user has a specific role
    /// </summary>
    [HttpGet("~/api/v1/users/{userId:guid}/roles/{roleName}/check")]
    [RequirePermission("users:read")]
    public async Task<ActionResult<bool>> CheckUserRole(Guid userId, string roleName)
    {
        try
        {
            var hasRole = await _roleService.UserHasRoleAsync(userId, roleName);
            return Ok(new { hasRole });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking user role {UserId} - {Role}", userId, roleName);
            return StatusCode(500, new { message = "Failed to check role" });
        }
    }
}