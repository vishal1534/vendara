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
/// Vendor inventory management controller
/// </summary>
[ApiController]
[Route("api/v1/vendors/{vendorId}/inventory")]
[Authorize]
public class VendorInventoryController : ControllerBase
{
    private readonly IVendorInventoryRepository _inventoryRepository;
    private readonly IVendorRepository _vendorRepository;
    private readonly ICachingService _cache;
    private readonly ILogger<VendorInventoryController> _logger;

    public VendorInventoryController(
        IVendorInventoryRepository inventoryRepository,
        IVendorRepository vendorRepository,
        ICachingService cache,
        ILogger<VendorInventoryController> logger)
    {
        _inventoryRepository = inventoryRepository;
        _vendorRepository = vendorRepository;
        _cache = cache;
        _logger = logger;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetInventory(Guid vendorId, [FromQuery] bool availableOnly = false)
    {
        var cacheKey = $"vendor-inventory:{vendorId}:{availableOnly}";
        var cached = await _cache.GetAsync<IEnumerable<VendorInventoryItemResponse>>(cacheKey);
        
        if (cached != null)
            return Ok(new { success = true, data = cached });

        var items = availableOnly
            ? await _inventoryRepository.GetAvailableByVendorIdAsync(vendorId)
            : await _inventoryRepository.GetByVendorIdAsync(vendorId);

        var response = items.Select(MapToResponse).ToList();
        await _cache.SetAsync(cacheKey, response, TimeSpan.FromMinutes(5));

        return Ok(new { success = true, data = response });
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetInventoryItem(Guid vendorId, Guid id)
    {
        var item = await _inventoryRepository.GetByIdAsync(id);
        
        if (item == null || item.VendorId != vendorId)
            return NotFound(new { success = false, message = "Inventory item not found" });

        return Ok(new { success = true, data = MapToResponse(item) });
    }

    [HttpPost]
    [Authorize(Policy = AuthorizationPolicies.VendorOrAdmin)]
    public async Task<IActionResult> AddInventoryItem(Guid vendorId, [FromBody] CreateInventoryItemRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, errors = ModelState });

        if (!await CanManageVendor(vendorId))
            return Forbid();

        // Check if item already exists
        var existing = await _inventoryRepository.GetByVendorAndMaterialAsync(vendorId, request.MaterialId);
        if (existing != null)
            return Conflict(new { success = false, message = "Material already exists in inventory" });

        var item = new VendorInventoryItem
        {
            Id = Guid.NewGuid(),
            VendorId = vendorId,
            MaterialId = request.MaterialId,
            UnitPrice = request.UnitPrice,
            MinimumOrderQuantity = request.MinimumOrderQuantity,
            MaximumOrderQuantity = request.MaximumOrderQuantity,
            DiscountPercentage = request.DiscountPercentage,
            BulkDiscountQuantity = request.BulkDiscountQuantity,
            BulkDiscountPercentage = request.BulkDiscountPercentage,
            IsInStock = request.IsInStock,
            StockQuantity = request.StockQuantity,
            TrackInventory = request.TrackInventory,
            LeadTimeDays = request.LeadTimeDays,
            Notes = request.Notes,
            BrandName = request.BrandName,
            QualityGrade = request.QualityGrade
        };

        var created = await _inventoryRepository.CreateAsync(item);
        await _cache.RemoveAsync($"vendor-inventory:{vendorId}:false");
        await _cache.RemoveAsync($"vendor-inventory:{vendorId}:true");

        return CreatedAtAction(
            nameof(GetInventoryItem),
            new { vendorId, id = created.Id },
            new { success = true, data = MapToResponse(created) });
    }

    [HttpPut("{id}")]
    [Authorize(Policy = AuthorizationPolicies.VendorOrAdmin)]
    public async Task<IActionResult> UpdateInventoryItem(
        Guid vendorId, Guid id, [FromBody] UpdateInventoryItemRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, errors = ModelState });

        if (!await CanManageVendor(vendorId))
            return Forbid();

        var item = await _inventoryRepository.GetByIdAsync(id);
        if (item == null || item.VendorId != vendorId)
            return NotFound(new { success = false, message = "Inventory item not found" });

        if (request.UnitPrice.HasValue) item.UnitPrice = request.UnitPrice.Value;
        if (request.MinimumOrderQuantity.HasValue) item.MinimumOrderQuantity = request.MinimumOrderQuantity;
        if (request.MaximumOrderQuantity.HasValue) item.MaximumOrderQuantity = request.MaximumOrderQuantity;
        if (request.DiscountPercentage.HasValue) item.DiscountPercentage = request.DiscountPercentage;
        if (request.BulkDiscountQuantity.HasValue) item.BulkDiscountQuantity = request.BulkDiscountQuantity;
        if (request.BulkDiscountPercentage.HasValue) item.BulkDiscountPercentage = request.BulkDiscountPercentage;
        if (request.IsInStock.HasValue) item.IsInStock = request.IsInStock.Value;
        if (request.StockQuantity.HasValue) item.StockQuantity = request.StockQuantity;
        if (request.TrackInventory.HasValue) item.TrackInventory = request.TrackInventory.Value;
        if (request.LeadTimeDays.HasValue) item.LeadTimeDays = request.LeadTimeDays;
        if (request.IsAvailable.HasValue) item.IsAvailable = request.IsAvailable.Value;
        if (request.Notes != null) item.Notes = request.Notes;
        if (request.BrandName != null) item.BrandName = request.BrandName;
        if (request.QualityGrade != null) item.QualityGrade = request.QualityGrade;

        var updated = await _inventoryRepository.UpdateAsync(item);
        await _cache.RemoveAsync($"vendor-inventory:{vendorId}:false");
        await _cache.RemoveAsync($"vendor-inventory:{vendorId}:true");

        return Ok(new { success = true, data = MapToResponse(updated) });
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = AuthorizationPolicies.VendorOrAdmin)]
    public async Task<IActionResult> DeleteInventoryItem(Guid vendorId, Guid id)
    {
        if (!await CanManageVendor(vendorId))
            return Forbid();

        var item = await _inventoryRepository.GetByIdAsync(id);
        if (item == null || item.VendorId != vendorId)
            return NotFound(new { success = false, message = "Inventory item not found" });

        await _inventoryRepository.DeleteAsync(id);
        await _cache.RemoveAsync($"vendor-inventory:{vendorId}:false");
        await _cache.RemoveAsync($"vendor-inventory:{vendorId}:true");

        return Ok(new { success = true, message = "Inventory item deleted" });
    }

    private VendorInventoryItemResponse MapToResponse(VendorInventoryItem item)
    {
        return new VendorInventoryItemResponse
        {
            Id = item.Id,
            VendorId = item.VendorId,
            MaterialId = item.MaterialId,
            UnitPrice = item.UnitPrice,
            MinimumOrderQuantity = item.MinimumOrderQuantity,
            MaximumOrderQuantity = item.MaximumOrderQuantity,
            DiscountPercentage = item.DiscountPercentage,
            BulkDiscountQuantity = item.BulkDiscountQuantity,
            BulkDiscountPercentage = item.BulkDiscountPercentage,
            IsInStock = item.IsInStock,
            StockQuantity = item.StockQuantity,
            TrackInventory = item.TrackInventory,
            LeadTimeDays = item.LeadTimeDays,
            IsAvailable = item.IsAvailable,
            Notes = item.Notes,
            BrandName = item.BrandName,
            QualityGrade = item.QualityGrade,
            CreatedAt = item.CreatedAt,
            UpdatedAt = item.UpdatedAt
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
