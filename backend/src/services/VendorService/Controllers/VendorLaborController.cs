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
/// Vendor labor availability management controller
/// </summary>
[ApiController]
[Route("api/v1/vendors/{vendorId}/labor")]
[Authorize]
public class VendorLaborController : ControllerBase
{
    private readonly IVendorLaborRepository _laborRepository;
    private readonly IVendorRepository _vendorRepository;
    private readonly ICachingService _cache;
    private readonly ILogger<VendorLaborController> _logger;

    public VendorLaborController(
        IVendorLaborRepository laborRepository,
        IVendorRepository vendorRepository,
        ICachingService cache,
        ILogger<VendorLaborController> logger)
    {
        _laborRepository = laborRepository;
        _vendorRepository = vendorRepository;
        _cache = cache;
        _logger = logger;
    }

    /// <summary>
    /// Get all labor availability for a vendor
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetLaborAvailability(Guid vendorId, [FromQuery] bool availableOnly = false)
    {
        var cacheKey = $"vendor-labor:{vendorId}:{availableOnly}";
        var cached = await _cache.GetAsync<IEnumerable<VendorLaborAvailabilityResponse>>(cacheKey);
        
        if (cached != null)
            return Ok(new { success = true, data = cached });

        var items = availableOnly
            ? await _laborRepository.GetAvailableByVendorIdAsync(vendorId)
            : await _laborRepository.GetByVendorIdAsync(vendorId);

        var response = items.Select(MapToResponse).ToList();
        await _cache.SetAsync(cacheKey, response, TimeSpan.FromMinutes(5));

        return Ok(new { success = true, data = response });
    }

    /// <summary>
    /// Get specific labor availability
    /// </summary>
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetLaborItem(Guid vendorId, Guid id)
    {
        var item = await _laborRepository.GetByIdAsync(id);
        
        if (item == null || item.VendorId != vendorId)
            return NotFound(new { success = false, message = "Labor availability not found" });

        return Ok(new { success = true, data = MapToResponse(item) });
    }

    /// <summary>
    /// Add labor availability
    /// </summary>
    [HttpPost]
    [Authorize(Policy = AuthorizationPolicies.VendorOrAdmin)]
    public async Task<IActionResult> AddLaborAvailability(
        Guid vendorId, 
        [FromBody] CreateLaborAvailabilityRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, errors = ModelState });

        if (!await CanManageVendor(vendorId))
            return Forbid();

        // Check if already exists
        var existing = await _laborRepository.GetByVendorAndLaborCategoryAsync(
            vendorId, request.LaborCategoryId, request.SkillLevel);
        
        if (existing != null)
            return Conflict(new { 
                success = false, 
                message = "Labor availability for this category and skill level already exists" 
            });

        var labor = new VendorLaborAvailability
        {
            Id = Guid.NewGuid(),
            VendorId = vendorId,
            LaborCategoryId = request.LaborCategoryId,
            AvailableWorkers = request.AvailableWorkers,
            SkillLevel = request.SkillLevel,
            HourlyRate = request.HourlyRate,
            DailyRate = request.DailyRate,
            WeeklyRate = request.WeeklyRate,
            MonthlyRate = request.MonthlyRate,
            OvertimeRate = request.OvertimeRate,
            AvailableFrom = request.AvailableFrom,
            AvailableUntil = request.AvailableUntil,
            MinimumBookingHours = request.MinimumBookingHours,
            MaximumBookingDays = request.MaximumBookingDays,
            YearsOfExperience = request.YearsOfExperience,
            Certifications = request.Certifications,
            SpecialSkills = request.SpecialSkills,
            LanguagesSpoken = request.LanguagesSpoken,
            ProvideTools = request.ProvideTools,
            ProvideSafetyEquipment = request.ProvideSafetyEquipment,
            Notes = request.Notes,
            IsAvailable = true
        };

        var created = await _laborRepository.CreateAsync(labor);
        
        // Invalidate cache
        await _cache.RemoveAsync($"vendor-labor:{vendorId}:false");
        await _cache.RemoveAsync($"vendor-labor:{vendorId}:true");

        _logger.LogInformation("Labor availability added for Vendor: {VendorId}, Category: {CategoryId}", 
            vendorId, request.LaborCategoryId);

        return CreatedAtAction(
            nameof(GetLaborItem),
            new { vendorId, id = created.Id },
            new { success = true, data = MapToResponse(created) });
    }

    /// <summary>
    /// Update labor availability
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Policy = AuthorizationPolicies.VendorOrAdmin)]
    public async Task<IActionResult> UpdateLaborAvailability(
        Guid vendorId, Guid id, [FromBody] UpdateLaborAvailabilityRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, errors = ModelState });

        if (!await CanManageVendor(vendorId))
            return Forbid();

        var labor = await _laborRepository.GetByIdAsync(id);
        if (labor == null || labor.VendorId != vendorId)
            return NotFound(new { success = false, message = "Labor availability not found" });

        if (request.AvailableWorkers.HasValue) labor.AvailableWorkers = request.AvailableWorkers.Value;
        if (request.HourlyRate.HasValue) labor.HourlyRate = request.HourlyRate.Value;
        if (request.DailyRate.HasValue) labor.DailyRate = request.DailyRate.Value;
        if (request.WeeklyRate.HasValue) labor.WeeklyRate = request.WeeklyRate;
        if (request.MonthlyRate.HasValue) labor.MonthlyRate = request.MonthlyRate;
        if (request.OvertimeRate.HasValue) labor.OvertimeRate = request.OvertimeRate;
        if (request.AvailableFrom.HasValue) labor.AvailableFrom = request.AvailableFrom;
        if (request.AvailableUntil.HasValue) labor.AvailableUntil = request.AvailableUntil;
        if (request.IsAvailable.HasValue) labor.IsAvailable = request.IsAvailable.Value;

        var updated = await _laborRepository.UpdateAsync(labor);
        
        // Invalidate cache
        await _cache.RemoveAsync($"vendor-labor:{vendorId}:false");
        await _cache.RemoveAsync($"vendor-labor:{vendorId}:true");

        return Ok(new { success = true, data = MapToResponse(updated) });
    }

    /// <summary>
    /// Delete labor availability
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Policy = AuthorizationPolicies.VendorOrAdmin)]
    public async Task<IActionResult> DeleteLaborAvailability(Guid vendorId, Guid id)
    {
        if (!await CanManageVendor(vendorId))
            return Forbid();

        var labor = await _laborRepository.GetByIdAsync(id);
        if (labor == null || labor.VendorId != vendorId)
            return NotFound(new { success = false, message = "Labor availability not found" });

        await _laborRepository.DeleteAsync(id);
        
        // Invalidate cache
        await _cache.RemoveAsync($"vendor-labor:{vendorId}:false");
        await _cache.RemoveAsync($"vendor-labor:{vendorId}:true");

        return Ok(new { success = true, message = "Labor availability deleted" });
    }

    private VendorLaborAvailabilityResponse MapToResponse(VendorLaborAvailability labor)
    {
        return new VendorLaborAvailabilityResponse
        {
            Id = labor.Id,
            VendorId = labor.VendorId,
            LaborCategoryId = labor.LaborCategoryId,
            AvailableWorkers = labor.AvailableWorkers,
            SkillLevel = labor.SkillLevel,
            HourlyRate = labor.HourlyRate,
            DailyRate = labor.DailyRate,
            WeeklyRate = labor.WeeklyRate,
            MonthlyRate = labor.MonthlyRate,
            OvertimeRate = labor.OvertimeRate,
            IsAvailable = labor.IsAvailable,
            AvailableFrom = labor.AvailableFrom,
            AvailableUntil = labor.AvailableUntil,
            MinimumBookingHours = labor.MinimumBookingHours,
            YearsOfExperience = labor.YearsOfExperience,
            Certifications = labor.Certifications,
            SpecialSkills = labor.SpecialSkills,
            LanguagesSpoken = labor.LanguagesSpoken,
            ProvideTools = labor.ProvideTools,
            ProvideSafetyEquipment = labor.ProvideSafetyEquipment,
            CreatedAt = labor.CreatedAt,
            UpdatedAt = labor.UpdatedAt
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
/// Request to update labor availability
/// </summary>
public class UpdateLaborAvailabilityRequest
{
    public int? AvailableWorkers { get; set; }
    public decimal? HourlyRate { get; set; }
    public decimal? DailyRate { get; set; }
    public decimal? WeeklyRate { get; set; }
    public decimal? MonthlyRate { get; set; }
    public decimal? OvertimeRate { get; set; }
    public DateTime? AvailableFrom { get; set; }
    public DateTime? AvailableUntil { get; set; }
    public bool? IsAvailable { get; set; }
}
