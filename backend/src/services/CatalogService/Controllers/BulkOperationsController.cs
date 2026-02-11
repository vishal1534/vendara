using Microsoft.AspNetCore.Mvc;
using CatalogService.Repositories;
using CatalogService.Models.DTOs;
using RealServ.Shared.Application.Models;

namespace CatalogService.Controllers;

/// <summary>
/// Bulk Operations for Catalog Items
/// Efficiently update multiple materials, labor categories, or vendors at once
/// </summary>
[ApiController]
[Route("api/v1/bulk")]
public class BulkOperationsController : ControllerBase
{
    private readonly IMaterialRepository _materialRepository;
    private readonly ILaborRepository _laborRepository;
    private readonly IVendorInventoryRepository _vendorInventoryRepository;
    private readonly ILogger<BulkOperationsController> _logger;

    public BulkOperationsController(
        IMaterialRepository materialRepository,
        ILaborRepository laborRepository,
        IVendorInventoryRepository vendorInventoryRepository,
        ILogger<BulkOperationsController> logger)
    {
        _materialRepository = materialRepository;
        _laborRepository = laborRepository;
        _vendorInventoryRepository = vendorInventoryRepository;
        _logger = logger;
    }

    /// <summary>
    /// Bulk activate/deactivate materials
    /// </summary>
    [HttpPost("materials/toggle-status")]
    public async Task<ActionResult<ApiResponse<BulkOperationResult>>> BulkToggleMaterials(
        [FromBody] BulkToggleRequest request)
    {
        try
        {
            var result = new BulkOperationResult();

            foreach (var id in request.Ids)
            {
                try
                {
                    var material = await _materialRepository.GetByIdAsync(id);
                    if (material == null)
                    {
                        result.FailedIds.Add(id);
                        result.Errors.Add($"Material {id} not found");
                        continue;
                    }

                    material.IsActive = request.IsActive;
                    await _materialRepository.UpdateAsync(material);
                    result.SuccessIds.Add(id);
                }
                catch (Exception ex)
                {
                    result.FailedIds.Add(id);
                    result.Errors.Add($"Error updating material {id}: {ex.Message}");
                    _logger.LogError(ex, "Error updating material {MaterialId}", id);
                }
            }

            result.TotalProcessed = request.Ids.Count;
            result.SuccessCount = result.SuccessIds.Count;
            result.FailedCount = result.FailedIds.Count;

            return Ok(new ApiResponse<BulkOperationResult>
            {
                Success = result.FailedCount == 0,
                Message = $"Processed {result.TotalProcessed} materials: {result.SuccessCount} successful, {result.FailedCount} failed",
                Data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in bulk toggle materials operation");
            return StatusCode(500, new ApiResponse<BulkOperationResult>
            {
                Success = false,
                Message = "An error occurred during bulk operation",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    /// <summary>
    /// Bulk activate/deactivate labor categories
    /// </summary>
    [HttpPost("labor-categories/toggle-status")]
    public async Task<ActionResult<ApiResponse<BulkOperationResult>>> BulkToggleLaborCategories(
        [FromBody] BulkToggleRequest request)
    {
        try
        {
            var result = new BulkOperationResult();

            foreach (var id in request.Ids)
            {
                try
                {
                    var labor = await _laborRepository.GetByIdAsync(id);
                    if (labor == null)
                    {
                        result.FailedIds.Add(id);
                        result.Errors.Add($"Labor category {id} not found");
                        continue;
                    }

                    labor.IsActive = request.IsActive;
                    await _laborRepository.UpdateAsync(labor);
                    result.SuccessIds.Add(id);
                }
                catch (Exception ex)
                {
                    result.FailedIds.Add(id);
                    result.Errors.Add($"Error updating labor category {id}: {ex.Message}");
                    _logger.LogError(ex, "Error updating labor category {LaborId}", id);
                }
            }

            result.TotalProcessed = request.Ids.Count;
            result.SuccessCount = result.SuccessIds.Count;
            result.FailedCount = result.FailedIds.Count;

            return Ok(new ApiResponse<BulkOperationResult>
            {
                Success = result.FailedCount == 0,
                Message = $"Processed {result.TotalProcessed} labor categories: {result.SuccessCount} successful, {result.FailedCount} failed",
                Data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in bulk toggle labor categories operation");
            return StatusCode(500, new ApiResponse<BulkOperationResult>
            {
                Success = false,
                Message = "An error occurred during bulk operation",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    /// <summary>
    /// Bulk update material prices
    /// </summary>
    [HttpPost("materials/update-prices")]
    public async Task<ActionResult<ApiResponse<BulkOperationResult>>> BulkUpdateMaterialPrices(
        [FromBody] BulkUpdatePricesRequest request)
    {
        try
        {
            var result = new BulkOperationResult();

            foreach (var priceUpdate in request.PriceUpdates)
            {
                try
                {
                    var material = await _materialRepository.GetByIdAsync(priceUpdate.Id);
                    if (material == null)
                    {
                        result.FailedIds.Add(priceUpdate.Id);
                        result.Errors.Add($"Material {priceUpdate.Id} not found");
                        continue;
                    }

                    material.BasePrice = priceUpdate.NewPrice;
                    await _materialRepository.UpdateAsync(material);
                    result.SuccessIds.Add(priceUpdate.Id);
                }
                catch (Exception ex)
                {
                    result.FailedIds.Add(priceUpdate.Id);
                    result.Errors.Add($"Error updating material price {priceUpdate.Id}: {ex.Message}");
                    _logger.LogError(ex, "Error updating material price {MaterialId}", priceUpdate.Id);
                }
            }

            result.TotalProcessed = request.PriceUpdates.Count;
            result.SuccessCount = result.SuccessIds.Count;
            result.FailedCount = result.FailedIds.Count;

            return Ok(new ApiResponse<BulkOperationResult>
            {
                Success = result.FailedCount == 0,
                Message = $"Processed {result.TotalProcessed} price updates: {result.SuccessCount} successful, {result.FailedCount} failed",
                Data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in bulk update prices operation");
            return StatusCode(500, new ApiResponse<BulkOperationResult>
            {
                Success = false,
                Message = "An error occurred during bulk operation",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    /// <summary>
    /// Bulk delete materials
    /// </summary>
    [HttpPost("materials/delete")]
    public async Task<ActionResult<ApiResponse<BulkOperationResult>>> BulkDeleteMaterials(
        [FromBody] BulkDeleteRequest request)
    {
        try
        {
            var result = new BulkOperationResult();

            foreach (var id in request.Ids)
            {
                try
                {
                    var deleted = await _materialRepository.DeleteAsync(id);
                    if (deleted)
                    {
                        result.SuccessIds.Add(id);
                    }
                    else
                    {
                        result.FailedIds.Add(id);
                        result.Errors.Add($"Material {id} not found");
                    }
                }
                catch (Exception ex)
                {
                    result.FailedIds.Add(id);
                    result.Errors.Add($"Error deleting material {id}: {ex.Message}");
                    _logger.LogError(ex, "Error deleting material {MaterialId}", id);
                }
            }

            result.TotalProcessed = request.Ids.Count;
            result.SuccessCount = result.SuccessIds.Count;
            result.FailedCount = result.FailedIds.Count;

            return Ok(new ApiResponse<BulkOperationResult>
            {
                Success = result.FailedCount == 0,
                Message = $"Processed {result.TotalProcessed} deletions: {result.SuccessCount} successful, {result.FailedCount} failed",
                Data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in bulk delete materials operation");
            return StatusCode(500, new ApiResponse<BulkOperationResult>
            {
                Success = false,
                Message = "An error occurred during bulk operation",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    /// <summary>
    /// Bulk update popular flag for materials
    /// </summary>
    [HttpPost("materials/toggle-popular")]
    public async Task<ActionResult<ApiResponse<BulkOperationResult>>> BulkTogglePopularMaterials(
        [FromBody] BulkToggleRequest request)
    {
        try
        {
            var result = new BulkOperationResult();

            foreach (var id in request.Ids)
            {
                try
                {
                    var material = await _materialRepository.GetByIdAsync(id);
                    if (material == null)
                    {
                        result.FailedIds.Add(id);
                        result.Errors.Add($"Material {id} not found");
                        continue;
                    }

                    material.IsPopular = request.IsActive;
                    await _materialRepository.UpdateAsync(material);
                    result.SuccessIds.Add(id);
                }
                catch (Exception ex)
                {
                    result.FailedIds.Add(id);
                    result.Errors.Add($"Error updating material {id}: {ex.Message}");
                    _logger.LogError(ex, "Error updating material {MaterialId}", id);
                }
            }

            result.TotalProcessed = request.Ids.Count;
            result.SuccessCount = result.SuccessIds.Count;
            result.FailedCount = result.FailedIds.Count;

            return Ok(new ApiResponse<BulkOperationResult>
            {
                Success = result.FailedCount == 0,
                Message = $"Processed {result.TotalProcessed} materials: {result.SuccessCount} successful, {result.FailedCount} failed",
                Data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in bulk toggle popular materials operation");
            return StatusCode(500, new ApiResponse<BulkOperationResult>
            {
                Success = false,
                Message = "An error occurred during bulk operation",
                Errors = new List<string> { ex.Message }
            });
        }
    }
}

public class BulkToggleRequest
{
    public List<Guid> Ids { get; set; } = new();
    public bool IsActive { get; set; }
}

public class BulkDeleteRequest
{
    public List<Guid> Ids { get; set; } = new();
}

public class BulkUpdatePricesRequest
{
    public List<PriceUpdate> PriceUpdates { get; set; } = new();
}

public class PriceUpdate
{
    public Guid Id { get; set; }
    public decimal NewPrice { get; set; }
}

public class BulkOperationResult
{
    public int TotalProcessed { get; set; }
    public int SuccessCount { get; set; }
    public int FailedCount { get; set; }
    public List<Guid> SuccessIds { get; set; } = new();
    public List<Guid> FailedIds { get; set; } = new();
    public List<string> Errors { get; set; } = new();
}
