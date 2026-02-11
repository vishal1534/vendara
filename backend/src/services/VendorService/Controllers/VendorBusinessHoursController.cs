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
/// Vendor business hours management controller
/// </summary>
[ApiController]
[Route("api/v1/vendors/{vendorId}/business-hours")]
[Authorize]
public class VendorBusinessHoursController : ControllerBase
{
    private readonly IVendorBusinessHourRepository _businessHourRepository;
    private readonly IVendorRepository _vendorRepository;
    private readonly ICachingService _cache;
    private readonly ILogger<VendorBusinessHoursController> _logger;

    public VendorBusinessHoursController(
        IVendorBusinessHourRepository businessHourRepository,
        IVendorRepository vendorRepository,
        ICachingService cache,
        ILogger<VendorBusinessHoursController> logger)
    {
        _businessHourRepository = businessHourRepository;
        _vendorRepository = vendorRepository;
        _cache = cache;
        _logger = logger;
    }

    /// <summary>
    /// Get business hours for a vendor
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetBusinessHours(Guid vendorId)
    {
        var hours = await _businessHourRepository.GetByVendorIdAsync(vendorId);
        var response = hours.Select(MapToResponse);

        return Ok(new { success = true, data = response });
    }

    /// <summary>
    /// Update business hours (bulk update)
    /// </summary>
    [HttpPut]
    [Authorize(Policy = AuthorizationPolicies.VendorOrAdmin)]
    public async Task<IActionResult> UpdateBusinessHours(
        Guid vendorId, 
        [FromBody] UpdateBusinessHoursRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, errors = ModelState });

        if (!await CanManageVendor(vendorId))
            return Forbid();

        // Validate time ranges
        foreach (var entry in request.Hours)
        {
            if (entry.IsOpen && entry.OpenTime >= entry.CloseTime)
            {
                return BadRequest(new { 
                    success = false, 
                    message = $"Invalid time range for {entry.DayOfWeek}: open time must be before close time" 
                });
            }

            if (entry.HasBreak && entry.BreakStartTime.HasValue && entry.BreakEndTime.HasValue)
            {
                if (entry.BreakStartTime >= entry.BreakEndTime)
                {
                    return BadRequest(new { 
                        success = false, 
                        message = $"Invalid break time for {entry.DayOfWeek}: break start must be before break end" 
                    });
                }

                if (entry.BreakStartTime < entry.OpenTime || entry.BreakEndTime > entry.CloseTime)
                {
                    return BadRequest(new { 
                        success = false, 
                        message = $"Break time for {entry.DayOfWeek} must be within business hours" 
                    });
                }
            }
        }

        // Delete existing hours
        await _businessHourRepository.DeleteByVendorIdAsync(vendorId);

        // Create new hours
        var newHours = request.Hours.Select(entry => new VendorBusinessHour
        {
            Id = Guid.NewGuid(),
            VendorId = vendorId,
            DayOfWeek = entry.DayOfWeek,
            IsOpen = entry.IsOpen,
            OpenTime = entry.OpenTime,
            CloseTime = entry.CloseTime,
            HasBreak = entry.HasBreak,
            BreakStartTime = entry.BreakStartTime,
            BreakEndTime = entry.BreakEndTime
        }).ToList();

        await _businessHourRepository.CreateBulkAsync(newHours);
        
        // Invalidate vendor cache
        await _cache.RemoveAsync($"vendor:{vendorId}");

        _logger.LogInformation("Business hours updated for Vendor: {VendorId}", vendorId);

        var response = newHours.Select(MapToResponse);
        return Ok(new { success = true, data = response });
    }

    private VendorBusinessHourResponse MapToResponse(VendorBusinessHour hour)
    {
        return new VendorBusinessHourResponse
        {
            Id = hour.Id,
            VendorId = hour.VendorId,
            DayOfWeek = hour.DayOfWeek,
            IsOpen = hour.IsOpen,
            OpenTime = hour.OpenTime,
            CloseTime = hour.CloseTime,
            HasBreak = hour.HasBreak,
            BreakStartTime = hour.BreakStartTime,
            BreakEndTime = hour.BreakEndTime
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
