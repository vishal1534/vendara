using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VendorService.Models.Authorization;
using VendorService.Models.Configuration;
using VendorService.Models.Entities;
using VendorService.Models.Requests;
using VendorService.Models.Responses;
using VendorService.Repositories;
using VendorService.Services;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace VendorService.Controllers;

/// <summary>
/// Vendor ratings and reviews controller
/// </summary>
[ApiController]
[Route("api/v1/vendors/{vendorId}/ratings")]
[Authorize]
public class VendorRatingsController : ControllerBase
{
    private readonly IVendorRatingRepository _ratingRepository;
    private readonly IVendorRepository _vendorRepository;
    private readonly ICachingService _cache;
    private readonly PaginationSettings _paginationSettings;
    private readonly ILogger<VendorRatingsController> _logger;

    public VendorRatingsController(
        IVendorRatingRepository ratingRepository,
        IVendorRepository vendorRepository,
        ICachingService cache,
        IOptions<PaginationSettings> paginationSettings,
        ILogger<VendorRatingsController> logger)
    {
        _ratingRepository = ratingRepository;
        _vendorRepository = vendorRepository;
        _cache = cache;
        _paginationSettings = paginationSettings.Value;
        _logger = logger;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetRatings(
        Guid vendorId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var safePage = _paginationSettings.GetSafePage(page);
        var safePageSize = _paginationSettings.GetSafePageSize(pageSize);

        var ratings = await _ratingRepository.GetByVendorIdAsync(vendorId, safePage, safePageSize);
        var response = ratings.Select(MapToResponse);

        return Ok(new { success = true, data = response });
    }

    [HttpGet("summary")]
    [AllowAnonymous]
    public async Task<IActionResult> GetRatingSummary(Guid vendorId)
    {
        var cacheKey = $"vendor-rating-summary:{vendorId}";
        var cached = await _cache.GetAsync<object>(cacheKey);
        
        if (cached != null)
            return Ok(new { success = true, data = cached });

        var (averageRating, totalCount) = await _ratingRepository.GetVendorRatingSummaryAsync(vendorId);

        var summary = new
        {
            averageRating,
            totalCount
        };

        await _cache.SetAsync(cacheKey, summary, TimeSpan.FromMinutes(30));

        return Ok(new { success = true, data = summary });
    }

    [HttpPost]
    [Authorize(Policy = AuthorizationPolicies.CustomerOrAdmin)]
    public async Task<IActionResult> CreateRating(Guid vendorId, [FromBody] CreateRatingRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, errors = ModelState });

        var customerId = GetUserIdFromClaims();

        // Check if rating already exists for this order
        var existing = await _ratingRepository.GetByOrderIdAsync(request.OrderId);
        if (existing != null)
            return Conflict(new { success = false, message = "Rating already exists for this order" });

        var rating = new VendorRating
        {
            Id = Guid.NewGuid(),
            VendorId = vendorId,
            OrderId = request.OrderId,
            CustomerId = customerId,
            Rating = request.Rating,
            Review = request.Review,
            QualityRating = request.QualityRating,
            TimelinessRating = request.TimelinessRating,
            CommunicationRating = request.CommunicationRating,
            ProfessionalismRating = request.ProfessionalismRating,
            IsVerifiedPurchase = true,
            IsPublic = true,
            IsApproved = true
        };

        var created = await _ratingRepository.CreateAsync(rating);

        // Update vendor average rating
        await UpdateVendorRating(vendorId);
        await _cache.RemoveAsync($"vendor-rating-summary:{vendorId}");

        _logger.LogInformation("Rating created for Vendor: {VendorId} by Customer: {CustomerId}", vendorId, customerId);

        return CreatedAtAction(
            nameof(GetRatings),
            new { vendorId },
            new { success = true, data = MapToResponse(created) });
    }

    [HttpPost("{ratingId}/respond")]
    [Authorize(Policy = AuthorizationPolicies.VendorOrAdmin)]
    public async Task<IActionResult> RespondToRating(
        Guid vendorId, Guid ratingId, [FromBody] string response)
    {
        if (!await CanManageVendor(vendorId))
            return Forbid();

        var rating = await _ratingRepository.GetByIdAsync(ratingId);
        if (rating == null || rating.VendorId != vendorId)
            return NotFound(new { success = false, message = "Rating not found" });

        rating.VendorResponse = response;
        rating.RespondedAt = DateTime.UtcNow;

        await _ratingRepository.UpdateAsync(rating);

        return Ok(new { success = true, data = MapToResponse(rating) });
    }

    private async Task UpdateVendorRating(Guid vendorId)
    {
        var (averageRating, totalCount) = await _ratingRepository.GetVendorRatingSummaryAsync(vendorId);
        
        var vendor = await _vendorRepository.GetByIdAsync(vendorId);
        if (vendor != null)
        {
            vendor.AverageRating = averageRating;
            vendor.TotalRatings = totalCount;
            await _vendorRepository.UpdateAsync(vendor);
            await _cache.RemoveAsync($"vendor:{vendorId}");
        }
    }

    private VendorRatingResponse MapToResponse(VendorRating rating)
    {
        return new VendorRatingResponse
        {
            Id = rating.Id,
            VendorId = rating.VendorId,
            OrderId = rating.OrderId,
            CustomerId = rating.CustomerId,
            Rating = rating.Rating,
            Review = rating.Review,
            QualityRating = rating.QualityRating,
            TimelinessRating = rating.TimelinessRating,
            CommunicationRating = rating.CommunicationRating,
            ProfessionalismRating = rating.ProfessionalismRating,
            IsVerifiedPurchase = rating.IsVerifiedPurchase,
            IsPublic = rating.IsPublic,
            VendorResponse = rating.VendorResponse,
            RespondedAt = rating.RespondedAt,
            CreatedAt = rating.CreatedAt
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
