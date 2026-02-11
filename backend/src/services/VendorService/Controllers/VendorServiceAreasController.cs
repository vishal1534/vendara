using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VendorService.Models.Authorization;
using VendorService.Models.Entities;
using VendorService.Models.Requests;
using VendorService.Models.Responses;
using VendorService.Repositories;
using VendorService.Services;
using System.Security.Claims;

namespace VendorService.Controllers;

/// <summary>
/// Vendor service areas management controller
/// </summary>
[ApiController]
[Route("api/v1/vendors/{vendorId}/service-areas")]
[Authorize]
public class VendorServiceAreasController : ControllerBase
{
    private readonly IVendorServiceAreaRepository _serviceAreaRepository;
    private readonly IVendorRepository _vendorRepository;
    private readonly ICachingService _cache;
    private readonly ILogger<VendorServiceAreasController> _logger;

    public VendorServiceAreasController(
        IVendorServiceAreaRepository serviceAreaRepository,
        IVendorRepository vendorRepository,
        ICachingService cache,
        ILogger<VendorServiceAreasController> logger)
    {
        _serviceAreaRepository = serviceAreaRepository;
        _vendorRepository = vendorRepository;
        _cache = cache;
        _logger = logger;
    }

    /// <summary>
    /// Get all service areas for a vendor
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetServiceAreas(Guid vendorId, [FromQuery] bool activeOnly = false)
    {
        var areas = activeOnly
            ? await _serviceAreaRepository.GetActiveByVendorIdAsync(vendorId)
            : await _serviceAreaRepository.GetByVendorIdAsync(vendorId);

        var response = areas.Select(MapToResponse);

        return Ok(new { success = true, data = response });
    }

    /// <summary>
    /// Get specific service area
    /// </summary>
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetServiceArea(Guid vendorId, Guid id)
    {
        var area = await _serviceAreaRepository.GetByIdAsync(id);
        
        if (area == null || area.VendorId != vendorId)
            return NotFound(new { success = false, message = "Service area not found" });

        return Ok(new { success = true, data = MapToResponse(area) });
    }

    /// <summary>
    /// Add a new service area
    /// </summary>
    [HttpPost]
    [Authorize(Policy = AuthorizationPolicies.VendorOrAdmin)]
    public async Task<IActionResult> AddServiceArea(Guid vendorId, [FromBody] CreateServiceAreaRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, errors = ModelState });

        if (!await CanManageVendor(vendorId))
            return Forbid();

        var area = new VendorServiceArea
        {
            Id = Guid.NewGuid(),
            VendorId = vendorId,
            AreaName = request.AreaName,
            Pincode = request.Pincode,
            City = request.City,
            State = request.State,
            DeliveryCharge = request.DeliveryCharge,
            DeliveryTimeDays = request.DeliveryTimeDays,
            MinimumOrderValue = request.MinimumOrderValue,
            IsActive = true
        };

        var created = await _serviceAreaRepository.CreateAsync(area);
        
        // Invalidate vendor cache
        await _cache.RemoveAsync($"vendor:{vendorId}");

        _logger.LogInformation("Service area added for Vendor: {VendorId}, Area: {AreaName}", 
            vendorId, request.AreaName);

        return CreatedAtAction(
            nameof(GetServiceArea),
            new { vendorId, id = created.Id },
            new { success = true, data = MapToResponse(created) });
    }

    /// <summary>
    /// Update a service area
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Policy = AuthorizationPolicies.VendorOrAdmin)]
    public async Task<IActionResult> UpdateServiceArea(
        Guid vendorId, Guid id, [FromBody] UpdateServiceAreaRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, errors = ModelState });

        if (!await CanManageVendor(vendorId))
            return Forbid();

        var area = await _serviceAreaRepository.GetByIdAsync(id);
        if (area == null || area.VendorId != vendorId)
            return NotFound(new { success = false, message = "Service area not found" });

        if (request.DeliveryCharge.HasValue) area.DeliveryCharge = request.DeliveryCharge;
        if (request.DeliveryTimeDays.HasValue) area.DeliveryTimeDays = request.DeliveryTimeDays;
        if (request.MinimumOrderValue.HasValue) area.MinimumOrderValue = request.MinimumOrderValue;
        if (request.IsActive.HasValue) area.IsActive = request.IsActive.Value;

        var updated = await _serviceAreaRepository.UpdateAsync(area);
        await _cache.RemoveAsync($"vendor:{vendorId}");

        return Ok(new { success = true, data = MapToResponse(updated) });
    }

    /// <summary>
    /// Delete a service area
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Policy = AuthorizationPolicies.VendorOrAdmin)]
    public async Task<IActionResult> DeleteServiceArea(Guid vendorId, Guid id)
    {
        if (!await CanManageVendor(vendorId))
            return Forbid();

        var area = await _serviceAreaRepository.GetByIdAsync(id);
        if (area == null || area.VendorId != vendorId)
            return NotFound(new { success = false, message = "Service area not found" });

        await _serviceAreaRepository.DeleteAsync(id);
        await _cache.RemoveAsync($"vendor:{vendorId}");

        _logger.LogInformation("Service area deleted: {AreaId} for Vendor: {VendorId}", id, vendorId);

        return Ok(new { success = true, message = "Service area deleted successfully" });
    }

    private VendorServiceAreaResponse MapToResponse(VendorServiceArea area)
    {
        return new VendorServiceAreaResponse
        {
            Id = area.Id,
            VendorId = area.VendorId,
            AreaName = area.AreaName,
            Pincode = area.Pincode,
            City = area.City,
            State = area.State,
            DeliveryCharge = area.DeliveryCharge,
            DeliveryTimeDays = area.DeliveryTimeDays,
            MinimumOrderValue = area.MinimumOrderValue,
            IsActive = area.IsActive,
            CreatedAt = area.CreatedAt
        };
    }

    private async Task<bool> CanManageVendor(Guid vendorId)
    {
        if (User.IsInRole(UserRoles.Admin))
            return true;

        var userId = GetUserIdFromClaims();
        var vendor = await _vendorRepository.GetByIdAsync(vendorId);
        return vendor != null && vendor.UserId == userId;
    }

    private Guid GetUserIdFromClaims()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
            ?? User.FindFirst("user_id")?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }
}

/// <summary>
/// Request to update service area
/// </summary>
public class UpdateServiceAreaRequest
{
    public decimal? DeliveryCharge { get; set; }
    public int? DeliveryTimeDays { get; set; }
    public decimal? MinimumOrderValue { get; set; }
    public bool? IsActive { get; set; }
}
