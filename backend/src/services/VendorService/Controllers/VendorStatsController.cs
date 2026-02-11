using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VendorService.Models.Authorization;
using VendorService.Repositories;
using VendorService.Services;
using System.Security.Claims;

namespace VendorService.Controllers;

/// <summary>
/// Vendor statistics and analytics controller
/// </summary>
[ApiController]
[Route("api/v1/vendors/{vendorId}")]
[Authorize]
public class VendorStatsController : ControllerBase
{
    private readonly IVendorRepository _vendorRepository;
    private readonly IVendorRatingRepository _ratingRepository;
    private readonly ICachingService _cache;
    private readonly ILogger<VendorStatsController> _logger;

    public VendorStatsController(
        IVendorRepository vendorRepository,
        IVendorRatingRepository ratingRepository,
        ICachingService cache,
        ILogger<VendorStatsController> logger)
    {
        _vendorRepository = vendorRepository;
        _ratingRepository = ratingRepository;
        _cache = cache;
        _logger = logger;
    }

    /// <summary>
    /// Get vendor statistics (dashboard metrics)
    /// </summary>
    [HttpGet("stats")]
    [Authorize(Policy = AuthorizationPolicies.VendorOrAdmin)]
    public async Task<IActionResult> GetVendorStats(Guid vendorId)
    {
        if (!await CanAccessVendor(vendorId))
            return Forbid();

        var cacheKey = $"vendor-stats:{vendorId}";
        var cached = await _cache.GetAsync<object>(cacheKey);
        
        if (cached != null)
            return Ok(new { success = true, data = cached });

        var vendor = await _vendorRepository.GetByIdAsync(vendorId);
        if (vendor == null)
            return NotFound(new { success = false, message = "Vendor not found" });

        // Calculate statistics
        var stats = new
        {
            // Order statistics (from vendor entity - updated by Order Service)
            totalOrders = vendor.TotalOrders,
            completedOrders = vendor.CompletedOrders,
            pendingOrders = vendor.TotalOrders - vendor.CompletedOrders,
            cancelledOrders = 0, // Would be tracked by Order Service
            
            // Financial metrics
            totalRevenue = vendor.TotalOrders * 5000m, // Placeholder - would come from Order Service
            averageOrderValue = vendor.TotalOrders > 0 ? 5000m : 0,
            
            // Performance metrics
            averageRating = vendor.AverageRating,
            totalRatings = vendor.TotalRatings,
            fulfillmentRate = vendor.FulfillmentRate ?? 0,
            responseTime = "< 2 hours", // Placeholder - would be calculated
            
            // Business metrics
            isActive = vendor.IsActive,
            isVerified = vendor.IsVerified,
            acceptingOrders = vendor.AcceptingOrders,
            
            // Timestamps
            createdAt = vendor.CreatedAt,
            lastActiveAt = vendor.LastActiveAt
        };

        await _cache.SetAsync(cacheKey, stats, TimeSpan.FromMinutes(5));

        return Ok(new { success = true, data = stats });
    }

    /// <summary>
    /// Get vendor performance metrics
    /// </summary>
    [HttpGet("performance")]
    [Authorize(Policy = AuthorizationPolicies.VendorOrAdmin)]
    public async Task<IActionResult> GetPerformanceMetrics(
        Guid vendorId,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        if (!await CanAccessVendor(vendorId))
            return Forbid();

        var vendor = await _vendorRepository.GetByIdAsync(vendorId);
        if (vendor == null)
            return NotFound(new { success = false, message = "Vendor not found" });

        // Set default date range (last 30 days)
        var start = startDate ?? DateTime.UtcNow.AddDays(-30);
        var end = endDate ?? DateTime.UtcNow;

        // Calculate performance metrics
        var performance = new
        {
            period = new
            {
                start,
                end,
                days = (end - start).Days
            },
            
            // Order performance
            orderMetrics = new
            {
                total = vendor.TotalOrders,
                completed = vendor.CompletedOrders,
                completionRate = vendor.TotalOrders > 0 
                    ? Math.Round((decimal)vendor.CompletedOrders / vendor.TotalOrders * 100, 2) 
                    : 0,
                fulfillmentRate = vendor.FulfillmentRate ?? 0
            },
            
            // Rating performance
            ratingMetrics = new
            {
                averageRating = vendor.AverageRating,
                totalRatings = vendor.TotalRatings,
                fiveStarCount = (int)(vendor.TotalRatings * 0.7), // Placeholder
                fourStarCount = (int)(vendor.TotalRatings * 0.2),
                threeStarCount = (int)(vendor.TotalRatings * 0.08),
                twoStarCount = (int)(vendor.TotalRatings * 0.01),
                oneStarCount = (int)(vendor.TotalRatings * 0.01)
            },
            
            // Quality metrics
            qualityMetrics = new
            {
                onTimeDeliveryRate = 95.5m, // Placeholder - would come from Order Service
                accuracyRate = 98.2m,
                customerSatisfaction = vendor.AverageRating * 20 // Convert 1-5 to percentage
            },
            
            // Business metrics
            businessMetrics = new
            {
                daysActive = (DateTime.UtcNow - vendor.CreatedAt).Days,
                averageResponseTime = "1.5 hours", // Placeholder
                issueResolutionTime = "6 hours" // Placeholder
            }
        };

        return Ok(new { success = true, data = performance });
    }

    /// <summary>
    /// Get vendor analytics (charts and trends)
    /// </summary>
    [HttpGet("analytics")]
    [Authorize(Policy = AuthorizationPolicies.VendorOrAdmin)]
    public async Task<IActionResult> GetAnalytics(
        Guid vendorId,
        [FromQuery] string period = "30days")
    {
        if (!await CanAccessVendor(vendorId))
            return Forbid();

        var vendor = await _vendorRepository.GetByIdAsync(vendorId);
        if (vendor == null)
            return NotFound(new { success = false, message = "Vendor not found" });

        // Generate trend data (placeholder - would come from aggregated Order Service data)
        var days = period switch
        {
            "7days" => 7,
            "30days" => 30,
            "90days" => 90,
            _ => 30
        };

        var orderTrend = GenerateOrderTrend(days, vendor.TotalOrders);
        var revenueTrend = GenerateRevenueTrend(days);
        var ratingTrend = GenerateRatingTrend(days, vendor.AverageRating);

        var analytics = new
        {
            period,
            trends = new
            {
                orders = orderTrend,
                revenue = revenueTrend,
                ratings = ratingTrend
            },
            
            // Category breakdown (placeholder)
            categoryPerformance = new[]
            {
                new { category = "Cement", orders = 45, revenue = 180000 },
                new { category = "Sand", orders = 32, revenue = 128000 },
                new { category = "Aggregate", orders = 28, revenue = 112000 },
                new { category = "Steel", orders = 18, revenue = 72000 }
            },
            
            // Peak hours (placeholder)
            peakHours = new[]
            {
                new { hour = 9, orders = 12 },
                new { hour = 10, orders = 18 },
                new { hour = 11, orders = 15 },
                new { hour = 14, orders = 20 },
                new { hour = 15, orders = 16 }
            },
            
            // Issues (placeholder)
            issues = new
            {
                total = 3,
                resolved = 2,
                pending = 1,
                averageResolutionTime = "6 hours"
            }
        };

        return Ok(new { success = true, data = analytics });
    }

    // Helper methods to generate trend data
    private List<object> GenerateOrderTrend(int days, int totalOrders)
    {
        var trend = new List<object>();
        var random = new Random();
        var baseOrders = Math.Max(totalOrders / days, 1);

        for (int i = days - 1; i >= 0; i--)
        {
            trend.Add(new
            {
                date = DateTime.UtcNow.AddDays(-i).ToString("yyyy-MM-dd"),
                orders = baseOrders + random.Next(-2, 3),
                completed = baseOrders + random.Next(-1, 2)
            });
        }

        return trend;
    }

    private List<object> GenerateRevenueTrend(int days)
    {
        var trend = new List<object>();
        var random = new Random();

        for (int i = days - 1; i >= 0; i--)
        {
            trend.Add(new
            {
                date = DateTime.UtcNow.AddDays(-i).ToString("yyyy-MM-dd"),
                revenue = 3000 + random.Next(-500, 1500)
            });
        }

        return trend;
    }

    private List<object> GenerateRatingTrend(int days, decimal averageRating)
    {
        var trend = new List<object>();
        var random = new Random();

        for (int i = days - 1; i >= 0; i--)
        {
            trend.Add(new
            {
                date = DateTime.UtcNow.AddDays(-i).ToString("yyyy-MM-dd"),
                rating = Math.Round(averageRating + (decimal)(random.NextDouble() - 0.5), 2),
                count = random.Next(1, 5)
            });
        }

        return trend;
    }

    private async Task<bool> CanAccessVendor(Guid vendorId)
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
