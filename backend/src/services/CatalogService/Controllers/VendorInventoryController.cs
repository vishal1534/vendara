using Microsoft.AspNetCore.Mvc;
using CatalogService.Repositories.Interfaces;
using CatalogService.Models.DTOs;
using CatalogService.Models.Entities;
using RealServ.Shared.Infrastructure.Middleware;

namespace CatalogService.Controllers;

/// <summary>
/// Vendor Inventory Management
/// Vendors manage their own material inventory and pricing
/// </summary>
[ApiController]
[Route("api/v1/vendor-inventory")]
[ServiceFilter(typeof(FirebaseAuthenticationFilter))]
public class VendorInventoryController : ControllerBase
{
    private readonly IVendorInventoryRepository _vendorInventoryRepository;
    private readonly IMaterialRepository _materialRepository;
    private readonly ILogger<VendorInventoryController> _logger;

    public VendorInventoryController(
        IVendorInventoryRepository vendorInventoryRepository,
        IMaterialRepository materialRepository,
        ILogger<VendorInventoryController> logger)
    {
        _vendorInventoryRepository = vendorInventoryRepository;
        _materialRepository = materialRepository;
        _logger = logger;
    }

    /// <summary>
    /// Get all inventory items for a specific vendor
    /// </summary>
    [HttpGet("vendor/{vendorId}")]
    public async Task<ActionResult<List<VendorInventoryDto>>> GetVendorInventory(Guid vendorId)
    {
        try
        {
            var inventoryItems = await _vendorInventoryRepository.GetByVendorIdAsync(vendorId);
            
            var dtos = inventoryItems.Select(item => new VendorInventoryDto
            {
                Id = item.Id,
                VendorId = item.VendorId,
                MaterialId = item.MaterialId,
                MaterialName = item.Material?.Name ?? "",
                MaterialUnit = item.Material?.Unit ?? "",
                VendorPrice = item.VendorPrice,
                StockQuantity = item.StockQuantity,
                MinOrderQuantity = item.MinOrderQuantity,
                MaxOrderQuantity = item.MaxOrderQuantity,
                LeadTimeDays = item.LeadTimeDays,
                IsAvailable = item.IsAvailable,
                LastRestockedAt = item.LastRestockedAt
            }).ToList();

            return Ok(dtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting vendor inventory for vendor {VendorId}", vendorId);
            return StatusCode(500, new { error = "Failed to retrieve vendor inventory" });
        }
    }

    /// <summary>
    /// Get a specific inventory item
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<VendorInventoryDto>> GetInventoryItem(Guid id)
    {
        try
        {
            var item = await _vendorInventoryRepository.GetByIdAsync(id);
            if (item == null)
            {
                return NotFound(new { error = "Inventory item not found" });
            }

            var dto = new VendorInventoryDto
            {
                Id = item.Id,
                VendorId = item.VendorId,
                MaterialId = item.MaterialId,
                MaterialName = item.Material?.Name ?? "",
                MaterialUnit = item.Material?.Unit ?? "",
                VendorPrice = item.VendorPrice,
                StockQuantity = item.StockQuantity,
                MinOrderQuantity = item.MinOrderQuantity,
                MaxOrderQuantity = item.MaxOrderQuantity,
                LeadTimeDays = item.LeadTimeDays,
                IsAvailable = item.IsAvailable,
                LastRestockedAt = item.LastRestockedAt
            };

            return Ok(dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting inventory item {Id}", id);
            return StatusCode(500, new { error = "Failed to retrieve inventory item" });
        }
    }

    /// <summary>
    /// Add material to vendor inventory
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<VendorInventoryDto>> AddInventoryItem([FromBody] CreateVendorInventoryRequest request)
    {
        try
        {
            // Verify material exists
            var material = await _materialRepository.GetByIdAsync(request.MaterialId);
            if (material == null)
            {
                return BadRequest(new { error = "Material not found" });
            }

            // Check if vendor already has this material
            var existingItem = await _vendorInventoryRepository.GetByVendorAndMaterialAsync(
                request.VendorId, request.MaterialId);
            
            if (existingItem != null)
            {
                return Conflict(new { error = "Vendor already has this material in inventory. Use PUT to update." });
            }

            var inventoryItem = new VendorInventory
            {
                VendorId = request.VendorId,
                MaterialId = request.MaterialId,
                VendorPrice = request.VendorPrice,
                StockQuantity = request.StockQuantity,
                MinOrderQuantity = request.MinOrderQuantity ?? material.MinOrderQuantity,
                MaxOrderQuantity = request.MaxOrderQuantity,
                LeadTimeDays = request.LeadTimeDays,
                IsAvailable = request.IsAvailable
            };

            var created = await _vendorInventoryRepository.CreateAsync(inventoryItem);

            var dto = new VendorInventoryDto
            {
                Id = created.Id,
                VendorId = created.VendorId,
                MaterialId = created.MaterialId,
                MaterialName = material.Name,
                MaterialUnit = material.Unit,
                VendorPrice = created.VendorPrice,
                StockQuantity = created.StockQuantity,
                MinOrderQuantity = created.MinOrderQuantity,
                MaxOrderQuantity = created.MaxOrderQuantity,
                LeadTimeDays = created.LeadTimeDays,
                IsAvailable = created.IsAvailable,
                LastRestockedAt = created.LastRestockedAt
            };

            return CreatedAtAction(nameof(GetInventoryItem), new { id = created.Id }, dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating inventory item");
            return StatusCode(500, new { error = "Failed to create inventory item" });
        }
    }

    /// <summary>
    /// Update vendor inventory item
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<VendorInventoryDto>> UpdateInventoryItem(
        Guid id, 
        [FromBody] UpdateVendorInventoryRequest request)
    {
        try
        {
            var existingItem = await _vendorInventoryRepository.GetByIdAsync(id);
            if (existingItem == null)
            {
                return NotFound(new { error = "Inventory item not found" });
            }

            // Update fields
            if (request.VendorPrice.HasValue)
                existingItem.VendorPrice = request.VendorPrice.Value;
            
            if (request.StockQuantity.HasValue)
                existingItem.StockQuantity = request.StockQuantity.Value;
            
            if (request.MinOrderQuantity.HasValue)
                existingItem.MinOrderQuantity = request.MinOrderQuantity.Value;
            
            if (request.MaxOrderQuantity.HasValue)
                existingItem.MaxOrderQuantity = request.MaxOrderQuantity;
            
            if (request.LeadTimeDays.HasValue)
                existingItem.LeadTimeDays = request.LeadTimeDays.Value;
            
            if (request.IsAvailable.HasValue)
                existingItem.IsAvailable = request.IsAvailable.Value;

            var updated = await _vendorInventoryRepository.UpdateAsync(existingItem);

            var dto = new VendorInventoryDto
            {
                Id = updated.Id,
                VendorId = updated.VendorId,
                MaterialId = updated.MaterialId,
                MaterialName = updated.Material?.Name ?? "",
                MaterialUnit = updated.Material?.Unit ?? "",
                VendorPrice = updated.VendorPrice,
                StockQuantity = updated.StockQuantity,
                MinOrderQuantity = updated.MinOrderQuantity,
                MaxOrderQuantity = updated.MaxOrderQuantity,
                LeadTimeDays = updated.LeadTimeDays,
                IsAvailable = updated.IsAvailable,
                LastRestockedAt = updated.LastRestockedAt
            };

            return Ok(dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating inventory item {Id}", id);
            return StatusCode(500, new { error = "Failed to update inventory item" });
        }
    }

    /// <summary>
    /// Toggle availability of inventory item
    /// </summary>
    [HttpPatch("{id}/toggle-availability")]
    public async Task<ActionResult> ToggleAvailability(Guid id)
    {
        try
        {
            var item = await _vendorInventoryRepository.GetByIdAsync(id);
            if (item == null)
            {
                return NotFound(new { error = "Inventory item not found" });
            }

            item.IsAvailable = !item.IsAvailable;
            await _vendorInventoryRepository.UpdateAsync(item);

            return Ok(new { 
                id = item.Id, 
                isAvailable = item.IsAvailable,
                message = item.IsAvailable ? "Item is now available" : "Item is now unavailable"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error toggling availability for item {Id}", id);
            return StatusCode(500, new { error = "Failed to toggle availability" });
        }
    }

    /// <summary>
    /// Delete inventory item
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteInventoryItem(Guid id)
    {
        try
        {
            var item = await _vendorInventoryRepository.GetByIdAsync(id);
            if (item == null)
            {
                return NotFound(new { error = "Inventory item not found" });
            }

            await _vendorInventoryRepository.DeleteAsync(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting inventory item {Id}", id);
            return StatusCode(500, new { error = "Failed to delete inventory item" });
        }
    }

    /// <summary>
    /// Update stock quantity (restock)
    /// </summary>
    [HttpPatch("{id}/restock")]
    public async Task<ActionResult> Restock(Guid id, [FromBody] RestockRequest request)
    {
        try
        {
            var item = await _vendorInventoryRepository.GetByIdAsync(id);
            if (item == null)
            {
                return NotFound(new { error = "Inventory item not found" });
            }

            item.StockQuantity = request.NewStockQuantity;
            item.LastRestockedAt = DateTime.UtcNow;
            
            await _vendorInventoryRepository.UpdateAsync(item);

            return Ok(new { 
                id = item.Id, 
                stockQuantity = item.StockQuantity,
                lastRestockedAt = item.LastRestockedAt,
                message = "Stock updated successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error restocking item {Id}", id);
            return StatusCode(500, new { error = "Failed to update stock" });
        }
    }

    /// <summary>
    /// Set stock alert threshold
    /// </summary>
    [HttpPatch("{id}/alert-threshold")]
    public async Task<ActionResult> SetAlertThreshold(Guid id, [FromBody] SetAlertThresholdRequest request)
    {
        try
        {
            var item = await _vendorInventoryRepository.GetByIdAsync(id);
            if (item == null)
            {
                return NotFound(new { error = "Inventory item not found" });
            }

            item.StockAlertThreshold = request.Threshold;
            await _vendorInventoryRepository.UpdateAsync(item);

            return Ok(new { 
                id = item.Id, 
                stockAlertThreshold = item.StockAlertThreshold,
                isLowStock = item.IsLowStock,
                message = "Alert threshold set successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting alert threshold for item {Id}", id);
            return StatusCode(500, new { error = "Failed to set alert threshold" });
        }
    }

    /// <summary>
    /// Get low stock alerts for vendor
    /// </summary>
    [HttpGet("vendor/{vendorId}/low-stock")]
    public async Task<ActionResult<List<VendorInventoryDto>>> GetLowStockItems(Guid vendorId)
    {
        try
        {
            var inventoryItems = await _vendorInventoryRepository.GetByVendorIdAsync(vendorId);
            
            var lowStockItems = inventoryItems
                .Where(item => item.IsLowStock)
                .Select(item => new VendorInventoryDto
                {
                    Id = item.Id,
                    VendorId = item.VendorId,
                    MaterialId = item.MaterialId,
                    MaterialName = item.Material?.Name ?? "",
                    MaterialUnit = item.Material?.Unit ?? "",
                    VendorPrice = item.VendorPrice,
                    StockQuantity = item.StockQuantity,
                    MinOrderQuantity = item.MinOrderQuantity,
                    MaxOrderQuantity = item.MaxOrderQuantity,
                    LeadTimeDays = item.LeadTimeDays,
                    IsAvailable = item.IsAvailable,
                    LastRestockedAt = item.LastRestockedAt
                }).ToList();

            return Ok(lowStockItems);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting low stock items for vendor {VendorId}", vendorId);
            return StatusCode(500, new { error = "Failed to retrieve low stock items" });
        }
    }
}

public class RestockRequest
{
    public decimal NewStockQuantity { get; set; }
}

public class SetAlertThresholdRequest
{
    public decimal? Threshold { get; set; }
}