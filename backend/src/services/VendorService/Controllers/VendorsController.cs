using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VendorService.Models.Authorization;
using VendorService.Models.Configuration;
using VendorService.Models.Entities;
using VendorService.Models.Enums;
using VendorService.Models.Requests;
using VendorService.Models.Responses;
using VendorService.Repositories;
using VendorService.Services;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace VendorService.Controllers;

/// <summary>
/// Vendor management controller
/// Handles vendor registration, profile management, and verification
/// </summary>
[ApiController]
[Route("api/v1/vendors")]
[Authorize]
public class VendorsController : ControllerBase
{
    private readonly IVendorRepository _vendorRepository;
    private readonly ICachingService _cache;
    private readonly PaginationSettings _paginationSettings;
    private readonly ILogger<VendorsController> _logger;

    public VendorsController(
        IVendorRepository vendorRepository,
        ICachingService cache,
        IOptions<PaginationSettings> paginationSettings,
        ILogger<VendorsController> logger)
    {
        _vendorRepository = vendorRepository;
        _cache = cache;
        _paginationSettings = paginationSettings.Value;
        _logger = logger;
    }

    /// <summary>
    /// Get all vendors (Admin only)
    /// </summary>
    [HttpGet]
    [Authorize(Policy = AuthorizationPolicies.AdminOnly)]
    public async Task<IActionResult> GetAllVendors(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] VendorStatus? status = null,
        [FromQuery] string? city = null,
        [FromQuery] string? search = null)
    {
        var safePage = _paginationSettings.GetSafePage(page);
        var safePageSize = _paginationSettings.GetSafePageSize(pageSize);

        var (vendors, totalCount) = await _vendorRepository.GetAllAsync(
            safePage, safePageSize, status, city, search);

        var response = vendors.Select(MapToResponse);

        return Ok(new
        {
            success = true,
            data = response,
            pagination = new
            {
                page = safePage,
                pageSize = safePageSize,
                totalCount,
                totalPages = (int)Math.Ceiling(totalCount / (double)safePageSize)
            }
        });
    }

    /// <summary>
    /// Get vendor by ID
    /// </summary>
    [HttpGet("{id}")]
    [Authorize(Policy = AuthorizationPolicies.AnyAuthenticated)]
    public async Task<IActionResult> GetVendorById(Guid id)
    {
        var cacheKey = $"vendor:{id}";
        var cached = await _cache.GetAsync<VendorResponse>(cacheKey);
        
        if (cached != null)
            return Ok(new { success = true, data = cached });

        var vendor = await _vendorRepository.GetByIdAsync(id);
        
        if (vendor == null)
            return NotFound(new { success = false, message = "Vendor not found" });

        var response = MapToResponse(vendor);
        await _cache.SetAsync(cacheKey, response, TimeSpan.FromMinutes(60));

        return Ok(new { success = true, data = response });
    }

    /// <summary>
    /// Get current vendor profile
    /// </summary>
    [HttpGet("me")]
    [Authorize(Policy = AuthorizationPolicies.VendorOnly)]
    public async Task<IActionResult> GetMyProfile()
    {
        var userId = GetUserIdFromClaims();
        var vendor = await _vendorRepository.GetByUserIdAsync(userId);
        
        if (vendor == null)
            return NotFound(new { success = false, message = "Vendor profile not found" });

        return Ok(new { success = true, data = MapToResponse(vendor) });
    }

    /// <summary>
    /// Register new vendor
    /// </summary>
    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> CreateVendor([FromBody] CreateVendorRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, errors = ModelState });

        var userId = GetUserIdFromClaims();

        // Check if vendor already exists for this user
        var existing = await _vendorRepository.GetByUserIdAsync(userId);
        if (existing != null)
            return Conflict(new { success = false, message = "Vendor profile already exists" });

        // Check if email already exists
        var existingEmail = await _vendorRepository.GetByEmailAsync(request.Email);
        if (existingEmail != null)
            return Conflict(new { success = false, message = "Email already registered" });

        var vendor = new Vendor
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            BusinessName = request.BusinessName,
            BusinessRegistrationNumber = request.BusinessRegistrationNumber,
            GstNumber = request.GstNumber,
            PanNumber = request.PanNumber,
            ContactPersonName = request.ContactPersonName,
            PhoneNumber = request.PhoneNumber,
            AlternatePhoneNumber = request.AlternatePhoneNumber,
            Email = request.Email,
            WhatsAppNumber = request.WhatsAppNumber,
            AddressLine1 = request.AddressLine1,
            AddressLine2 = request.AddressLine2,
            Landmark = request.Landmark,
            City = request.City,
            State = request.State,
            PostalCode = request.PostalCode,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            Description = request.Description,
            YearsInBusiness = request.YearsInBusiness,
            BusinessType = request.BusinessType,
            SpecializationAreas = request.SpecializationAreas,
            MinimumOrderValue = request.MinimumOrderValue,
            AcceptsCredit = request.AcceptsCredit,
            CreditDays = request.CreditDays,
            Status = VendorStatus.PendingVerification
        };

        var created = await _vendorRepository.CreateAsync(vendor);
        _logger.LogInformation("Vendor created: {VendorId} for User: {UserId}", created.Id, userId);

        return CreatedAtAction(
            nameof(GetVendorById),
            new { id = created.Id },
            new { success = true, data = MapToResponse(created) });
    }

    /// <summary>
    /// Update vendor profile
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Policy = AuthorizationPolicies.VendorOrAdmin)]
    public async Task<IActionResult> UpdateVendor(Guid id, [FromBody] UpdateVendorRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, errors = ModelState });

        var vendor = await _vendorRepository.GetByIdAsync(id);
        if (vendor == null)
            return NotFound(new { success = false, message = "Vendor not found" });

        // Check authorization (vendors can only update their own profile)
        if (!IsAdmin() && vendor.UserId != GetUserIdFromClaims())
            return Forbid();

        // Update fields if provided
        if (request.BusinessName != null) vendor.BusinessName = request.BusinessName;
        if (request.ContactPersonName != null) vendor.ContactPersonName = request.ContactPersonName;
        if (request.AlternatePhoneNumber != null) vendor.AlternatePhoneNumber = request.AlternatePhoneNumber;
        if (request.WhatsAppNumber != null) vendor.WhatsAppNumber = request.WhatsAppNumber;
        if (request.AddressLine1 != null) vendor.AddressLine1 = request.AddressLine1;
        if (request.AddressLine2 != null) vendor.AddressLine2 = request.AddressLine2;
        if (request.Landmark != null) vendor.Landmark = request.Landmark;
        if (request.City != null) vendor.City = request.City;
        if (request.State != null) vendor.State = request.State;
        if (request.PostalCode != null) vendor.PostalCode = request.PostalCode;
        if (request.Latitude.HasValue) vendor.Latitude = request.Latitude;
        if (request.Longitude.HasValue) vendor.Longitude = request.Longitude;
        if (request.Description != null) vendor.Description = request.Description;
        if (request.YearsInBusiness.HasValue) vendor.YearsInBusiness = request.YearsInBusiness.Value;
        if (request.BusinessType != null) vendor.BusinessType = request.BusinessType;
        if (request.SpecializationAreas != null) vendor.SpecializationAreas = request.SpecializationAreas;
        if (request.MinimumOrderValue.HasValue) vendor.MinimumOrderValue = request.MinimumOrderValue;
        if (request.AcceptsCredit.HasValue) vendor.AcceptsCredit = request.AcceptsCredit.Value;
        if (request.CreditDays.HasValue) vendor.CreditDays = request.CreditDays;
        if (request.AcceptingOrders.HasValue) vendor.AcceptingOrders = request.AcceptingOrders.Value;

        var updated = await _vendorRepository.UpdateAsync(vendor);
        
        // Invalidate cache
        await _cache.RemoveAsync($"vendor:{id}");

        return Ok(new { success = true, data = MapToResponse(updated) });
    }

    /// <summary>
    /// Verify vendor (Admin only)
    /// </summary>
    [HttpPatch("{id}/verify")]
    [Authorize(Policy = AuthorizationPolicies.AdminOnly)]
    public async Task<IActionResult> VerifyVendor(Guid id)
    {
        var vendor = await _vendorRepository.GetByIdAsync(id);
        if (vendor == null)
            return NotFound(new { success = false, message = "Vendor not found" });

        vendor.Status = VendorStatus.Active;
        vendor.IsVerified = true;
        vendor.VerifiedAt = DateTime.UtcNow;
        vendor.VerifiedBy = GetUserIdFromClaims();

        await _vendorRepository.UpdateAsync(vendor);
        await _cache.RemoveAsync($"vendor:{id}");

        _logger.LogInformation("Vendor verified: {VendorId} by Admin: {AdminId}", id, vendor.VerifiedBy);

        return Ok(new { success = true, data = MapToResponse(vendor) });
    }

    /// <summary>
    /// Update vendor status (Admin only)
    /// </summary>
    [HttpPatch("{id}/status")]
    [Authorize(Policy = AuthorizationPolicies.AdminOnly)]
    public async Task<IActionResult> UpdateVendorStatus(
        Guid id,
        [FromBody] VendorStatus status,
        [FromBody] string? reason = null)
    {
        var vendor = await _vendorRepository.GetByIdAsync(id);
        if (vendor == null)
            return NotFound(new { success = false, message = "Vendor not found" });

        vendor.Status = status;
        if (status == VendorStatus.Rejected)
            vendor.RejectionReason = reason;

        await _vendorRepository.UpdateAsync(vendor);
        await _cache.RemoveAsync($"vendor:{id}");

        _logger.LogInformation("Vendor status updated: {VendorId} to {Status}", id, status);

        return Ok(new { success = true, data = MapToResponse(vendor) });
    }

    /// <summary>
    /// Search vendors
    /// </summary>
    [HttpGet("search")]
    [AllowAnonymous]
    public async Task<IActionResult> SearchVendors(
        [FromQuery] string query,
        [FromQuery] string? city = null,
        [FromQuery] int limit = 10)
    {
        if (string.IsNullOrWhiteSpace(query))
            return BadRequest(new { success = false, message = "Search query is required" });

        var vendors = await _vendorRepository.SearchAsync(query, city, limit);
        var response = vendors.Select(MapToResponse);

        return Ok(new { success = true, data = response });
    }

    /// <summary>
    /// Get top-rated vendors
    /// </summary>
    [HttpGet("top-rated")]
    [AllowAnonymous]
    public async Task<IActionResult> GetTopRatedVendors(
        [FromQuery] int limit = 10,
        [FromQuery] string? city = null)
    {
        var cacheKey = $"top-rated-vendors:{city ?? "all"}:{limit}";
        var cached = await _cache.GetAsync<IEnumerable<VendorResponse>>(cacheKey);
        
        if (cached != null)
            return Ok(new { success = true, data = cached });

        var vendors = await _vendorRepository.GetTopRatedAsync(limit, city);
        var response = vendors.Select(MapToResponse).ToList();

        await _cache.SetAsync(cacheKey, response, TimeSpan.FromMinutes(30));

        return Ok(new { success = true, data = response });
    }

    /// <summary>
    /// Deactivate vendor
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Policy = AuthorizationPolicies.VendorOrAdmin)]
    public async Task<IActionResult> DeactivateVendor(Guid id)
    {
        var vendor = await _vendorRepository.GetByIdAsync(id);
        if (vendor == null)
            return NotFound(new { success = false, message = "Vendor not found" });

        // Check authorization
        if (!IsAdmin() && vendor.UserId != GetUserIdFromClaims())
            return Forbid();

        await _vendorRepository.DeleteAsync(id);
        await _cache.RemoveAsync($"vendor:{id}");

        _logger.LogInformation("Vendor deactivated: {VendorId}", id);

        return Ok(new { success = true, message = "Vendor deactivated successfully" });
    }

    /// <summary>
    /// Toggle vendor availability (accepting orders)
    /// </summary>
    [HttpPatch("{id}/availability")]
    [Authorize(Policy = AuthorizationPolicies.VendorOrAdmin)]
    public async Task<IActionResult> ToggleAvailability(Guid id, [FromBody] ToggleAvailabilityRequest request)
    {
        var vendor = await _vendorRepository.GetByIdAsync(id);
        if (vendor == null)
            return NotFound(new { success = false, message = "Vendor not found" });

        // Check authorization
        if (!IsAdmin() && vendor.UserId != GetUserIdFromClaims())
            return Forbid();

        vendor.AcceptingOrders = request.IsAvailable;
        vendor.LastActiveAt = DateTime.UtcNow;

        await _vendorRepository.UpdateAsync(vendor);
        await _cache.RemoveAsync($"vendor:{id}");

        _logger.LogInformation("Vendor availability toggled: {VendorId} to {IsAvailable}", id, request.IsAvailable);

        return Ok(new { 
            success = true, 
            data = new { 
                isAvailable = vendor.AcceptingOrders,
                lastActiveAt = vendor.LastActiveAt
            } 
        });
    }

    /// <summary>
    /// Get vendor onboarding status
    /// </summary>
    [HttpGet("{id}/onboarding/status")]
    [Authorize(Policy = AuthorizationPolicies.VendorOrAdmin)]
    public async Task<IActionResult> GetOnboardingStatus(Guid id)
    {
        var vendor = await _vendorRepository.GetByIdAsync(id);
        if (vendor == null)
            return NotFound(new { success = false, message = "Vendor not found" });

        // Check authorization
        if (!IsAdmin() && vendor.UserId != GetUserIdFromClaims())
            return Forbid();

        var status = new
        {
            isComplete = vendor.OnboardingCompletedAt.HasValue,
            completedAt = vendor.OnboardingCompletedAt,
            steps = new
            {
                businessInfo = new
                {
                    completed = !string.IsNullOrEmpty(vendor.BusinessName) && !string.IsNullOrEmpty(vendor.City),
                    progress = 100
                },
                kycDocuments = new
                {
                    completed = vendor.IsVerified,
                    progress = vendor.IsVerified ? 100 : 0
                },
                bankDetails = new
                {
                    completed = false, // Would check VendorBankAccounts table
                    progress = 0
                },
                serviceAreas = new
                {
                    completed = false, // Would check VendorServiceAreas table
                    progress = 0
                },
                catalog = new
                {
                    completed = false, // Would check VendorInventoryItems table
                    progress = 0
                }
            },
            overallProgress = vendor.OnboardingCompletedAt.HasValue ? 100 : CalculateOnboardingProgress(vendor)
        };

        return Ok(new { success = true, data = status });
    }

    /// <summary>
    /// Complete vendor onboarding
    /// </summary>
    [HttpPost("{id}/onboarding/complete")]
    [Authorize(Policy = AuthorizationPolicies.VendorOrAdmin)]
    public async Task<IActionResult> CompleteOnboarding(Guid id)
    {
        var vendor = await _vendorRepository.GetByIdAsync(id);
        if (vendor == null)
            return NotFound(new { success = false, message = "Vendor not found" });

        // Check authorization
        if (!IsAdmin() && vendor.UserId != GetUserIdFromClaims())
            return Forbid();

        if (vendor.OnboardingCompletedAt.HasValue)
        {
            return BadRequest(new { success = false, message = "Onboarding already completed" });
        }

        vendor.OnboardingCompletedAt = DateTime.UtcNow;
        await _vendorRepository.UpdateAsync(vendor);
        await _cache.RemoveAsync($"vendor:{id}");

        _logger.LogInformation("Vendor onboarding completed: {VendorId}", id);

        return Ok(new { 
            success = true, 
            message = "Onboarding completed successfully",
            data = new { completedAt = vendor.OnboardingCompletedAt }
        });
    }

    // Helper methods
    private VendorResponse MapToResponse(Vendor vendor)
    {
        return new VendorResponse
        {
            Id = vendor.Id,
            UserId = vendor.UserId,
            BusinessName = vendor.BusinessName,
            BusinessRegistrationNumber = vendor.BusinessRegistrationNumber,
            GstNumber = vendor.GstNumber,
            PanNumber = vendor.PanNumber,
            ContactPersonName = vendor.ContactPersonName,
            PhoneNumber = vendor.PhoneNumber,
            AlternatePhoneNumber = vendor.AlternatePhoneNumber,
            Email = vendor.Email,
            WhatsAppNumber = vendor.WhatsAppNumber,
            AddressLine1 = vendor.AddressLine1,
            AddressLine2 = vendor.AddressLine2,
            Landmark = vendor.Landmark,
            City = vendor.City,
            State = vendor.State,
            PostalCode = vendor.PostalCode,
            Latitude = vendor.Latitude,
            Longitude = vendor.Longitude,
            Description = vendor.Description,
            YearsInBusiness = vendor.YearsInBusiness,
            BusinessType = vendor.BusinessType,
            SpecializationAreas = vendor.SpecializationAreas,
            Status = vendor.Status,
            IsVerified = vendor.IsVerified,
            VerifiedAt = vendor.VerifiedAt,
            AverageRating = vendor.AverageRating,
            TotalRatings = vendor.TotalRatings,
            TotalOrders = vendor.TotalOrders,
            CompletedOrders = vendor.CompletedOrders,
            FulfillmentRate = vendor.FulfillmentRate,
            IsActive = vendor.IsActive,
            AcceptingOrders = vendor.AcceptingOrders,
            MinimumOrderValue = vendor.MinimumOrderValue,
            AcceptsCredit = vendor.AcceptsCredit,
            CreditDays = vendor.CreditDays,
            CreatedAt = vendor.CreatedAt,
            UpdatedAt = vendor.UpdatedAt,
            LastActiveAt = vendor.LastActiveAt
        };
    }

    private Guid GetUserIdFromClaims()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
            ?? User.FindFirst("user_id")?.Value;
        
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }

    private bool IsAdmin()
    {
        return User.IsInRole(UserRoles.Admin);
    }

    private int CalculateOnboardingProgress(Vendor vendor)
    {
        var totalSteps = 5;
        var completedSteps = 0;

        if (!string.IsNullOrEmpty(vendor.BusinessName) && !string.IsNullOrEmpty(vendor.City))
            completedSteps++;

        if (vendor.IsVerified)
            completedSteps++;

        return (int)((completedSteps / (double)totalSteps) * 100);
    }
}