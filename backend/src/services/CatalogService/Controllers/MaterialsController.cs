using CatalogService.Models.DTOs;
using CatalogService.Models.Entities;
using CatalogService.Models.Authorization;
using CatalogService.Models.Configuration;
using CatalogService.Repositories;
using CatalogService.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using System.ComponentModel.DataAnnotations;
using RealServ.Shared.Application.Models;

namespace CatalogService.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class MaterialsController : ControllerBase
{
    private readonly IMaterialRepository _materialRepository;
    private readonly ILogger<MaterialsController> _logger;
    private readonly PaginationSettings _paginationSettings;

    public MaterialsController(
        IMaterialRepository materialRepository,
        ILogger<MaterialsController> logger,
        IOptions<PaginationSettings> paginationSettings)
    {
        _materialRepository = materialRepository;
        _logger = logger;
        _paginationSettings = paginationSettings.Value;
    }

    /// <summary>
    /// Get all materials with pagination
    /// </summary>
    [HttpGet]
    [AllowAnonymous] // Public catalog access
    public async Task<ActionResult<ApiResponse<SearchResultsDto<MaterialDto>>>> GetMaterials(
        [FromQuery] Guid? categoryId = null,
        [FromQuery] bool includeInactive = false,
        [FromQuery, Range(1, int.MaxValue)] int page = 1,
        [FromQuery, Range(1, 100)] int pageSize = 20)
    {
        try
        {
            // Validate pagination
            page = _paginationSettings.ValidatePage(page);
            pageSize = _paginationSettings.ValidatePageSize(pageSize);

            (List<Material> materials, int totalCount) result;

            if (categoryId.HasValue)
            {
                result = await _materialRepository.GetByCategoryAsync(categoryId.Value, includeInactive, page, pageSize);
            }
            else
            {
                result = await _materialRepository.GetAllAsync(includeInactive, page, pageSize);
            }

            var dtos = result.materials.ToDtos();

            var response = new SearchResultsDto<MaterialDto>
            {
                Results = dtos,
                TotalCount = result.totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling((double)result.totalCount / pageSize)
            };

            return Ok(new ApiResponse<SearchResultsDto<MaterialDto>>
            {
                Success = true,
                Message = $"Retrieved {dtos.Count} of {result.totalCount} materials",
                Data = response
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving materials");
            return StatusCode(500, new ApiResponse<SearchResultsDto<MaterialDto>>
            {
                Success = false,
                Message = "An error occurred while retrieving materials"
            });
        }
    }

    /// <summary>
    /// Get material by ID
    /// </summary>
    [HttpGet("{id}")]
    [AllowAnonymous] // Public catalog access
    public async Task<ActionResult<ApiResponse<MaterialDto>>> GetMaterial(Guid id)
    {
        try
        {
            var material = await _materialRepository.GetByIdAsync(id);
            if (material == null)
            {
                return NotFound(new ApiResponse<MaterialDto>
                {
                    Success = false,
                    Message = "Material not found"
                });
            }

            var dto = new MaterialDto
            {
                Id = material.Id,
                CategoryId = material.CategoryId,
                CategoryName = material.Category?.Name ?? string.Empty,
                Name = material.Name,
                Description = material.Description,
                Sku = material.Sku,
                BasePrice = material.BasePrice,
                Unit = material.Unit,
                MinOrderQuantity = material.MinOrderQuantity,
                MaxOrderQuantity = material.MaxOrderQuantity,
                ImageUrl = material.ImageUrl,
                Brand = material.Brand,
                Specifications = material.Specifications,
                HsnCode = material.HsnCode,
                GstPercentage = material.GstPercentage,
                IsActive = material.IsActive,
                DisplayOrder = material.DisplayOrder,
                IsPopular = material.IsPopular,
                Tags = string.IsNullOrEmpty(material.Tags) 
                    ? new List<string>() 
                    : System.Text.Json.JsonSerializer.Deserialize<List<string>>(material.Tags) ?? new List<string>(),
                // Note: AvailableVendors, AverageVendorPrice, InStock, StockLevel are calculated via /stats endpoints
                AvailableVendors = 0,
                AverageVendorPrice = null,
                InStock = false,
                StockLevel = null
            };

            return Ok(new ApiResponse<MaterialDto>
            {
                Success = true,
                Data = dto
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving material {Id}", id);
            return StatusCode(500, new ApiResponse<MaterialDto>
            {
                Success = false,
                Message = "An error occurred while retrieving the material",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    /// <summary>
    /// Create new material (Admin only)
    /// </summary>
    [HttpPost]
    [Authorize(Policy = AuthorizationPolicies.AdminOnly)]
    public async Task<ActionResult<ApiResponse<MaterialDto>>> CreateMaterial([FromBody] CreateMaterialRequest request)
    {
        try
        {
            var material = new Material
            {
                CategoryId = request.CategoryId,
                Name = request.Name,
                Description = request.Description,
                Sku = request.Sku,
                BasePrice = request.BasePrice,
                Unit = request.Unit,
                MinOrderQuantity = request.MinOrderQuantity,
                MaxOrderQuantity = request.MaxOrderQuantity,
                ImageUrl = request.ImageUrl,
                Brand = request.Brand,
                Specifications = request.Specifications,
                HsnCode = request.HsnCode,
                GstPercentage = request.GstPercentage,
                DisplayOrder = request.DisplayOrder,
                IsActive = true,
                IsPopular = request.IsPopular,
                Tags = request.Tags.Any() 
                    ? System.Text.Json.JsonSerializer.Serialize(request.Tags) 
                    : null
            };

            var created = await _materialRepository.CreateAsync(material);

            var dto = new MaterialDto
            {
                Id = created.Id,
                CategoryId = created.CategoryId,
                CategoryName = string.Empty,
                Name = created.Name,
                Description = created.Description,
                Sku = created.Sku,
                BasePrice = created.BasePrice,
                Unit = created.Unit,
                MinOrderQuantity = created.MinOrderQuantity,
                MaxOrderQuantity = created.MaxOrderQuantity,
                ImageUrl = created.ImageUrl,
                Brand = created.Brand,
                Specifications = created.Specifications,
                HsnCode = created.HsnCode,
                GstPercentage = created.GstPercentage,
                IsActive = created.IsActive,
                DisplayOrder = created.DisplayOrder,
                IsPopular = created.IsPopular,
                Tags = string.IsNullOrEmpty(created.Tags) 
                    ? new List<string>() 
                    : System.Text.Json.JsonSerializer.Deserialize<List<string>>(created.Tags) ?? new List<string>(),
                // Note: AvailableVendors, AverageVendorPrice, InStock, StockLevel are calculated via /stats endpoints
                AvailableVendors = 0,
                AverageVendorPrice = null,
                InStock = false,
                StockLevel = null
            };

            _logger.LogInformation("Created material: {MaterialId} - {MaterialName}", created.Id, created.Name);

            return CreatedAtAction(nameof(GetMaterial), new { id = created.Id }, new ApiResponse<MaterialDto>
            {
                Success = true,
                Message = "Material created successfully",
                Data = dto
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating material");
            return StatusCode(500, new ApiResponse<MaterialDto>
            {
                Success = false,
                Message = "An error occurred while creating the material",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    /// <summary>
    /// Update material (Admin only)
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Policy = AuthorizationPolicies.AdminOnly)]
    public async Task<ActionResult<ApiResponse<MaterialDto>>> UpdateMaterial(Guid id, [FromBody] UpdateMaterialRequest request)
    {
        try
        {
            var material = await _materialRepository.GetByIdAsync(id);
            if (material == null)
            {
                return NotFound(new ApiResponse<MaterialDto>
                {
                    Success = false,
                    Message = "Material not found"
                });
            }

            if (request.Name != null) material.Name = request.Name;
            if (request.Description != null) material.Description = request.Description;
            if (request.BasePrice.HasValue) material.BasePrice = request.BasePrice.Value;
            if (request.MinOrderQuantity.HasValue) material.MinOrderQuantity = request.MinOrderQuantity.Value;
            if (request.MaxOrderQuantity.HasValue) material.MaxOrderQuantity = request.MaxOrderQuantity.Value;
            if (request.ImageUrl != null) material.ImageUrl = request.ImageUrl;
            if (request.Brand != null) material.Brand = request.Brand;
            if (request.Specifications != null) material.Specifications = request.Specifications;
            if (request.GstPercentage.HasValue) material.GstPercentage = request.GstPercentage.Value;
            if (request.IsActive.HasValue) material.IsActive = request.IsActive.Value;
            if (request.DisplayOrder.HasValue) material.DisplayOrder = request.DisplayOrder.Value;
            if (request.IsPopular.HasValue) material.IsPopular = request.IsPopular.Value;
            if (request.Tags != null && request.Tags.Any()) material.Tags = System.Text.Json.JsonSerializer.Serialize(request.Tags);

            var updated = await _materialRepository.UpdateAsync(material);

            var dto = new MaterialDto
            {
                Id = updated.Id,
                CategoryId = updated.CategoryId,
                CategoryName = updated.Category?.Name ?? string.Empty,
                Name = updated.Name,
                Description = updated.Description,
                Sku = updated.Sku,
                BasePrice = updated.BasePrice,
                Unit = updated.Unit,
                MinOrderQuantity = updated.MinOrderQuantity,
                MaxOrderQuantity = updated.MaxOrderQuantity,
                ImageUrl = updated.ImageUrl,
                Brand = updated.Brand,
                Specifications = updated.Specifications,
                HsnCode = updated.HsnCode,
                GstPercentage = updated.GstPercentage,
                IsActive = updated.IsActive,
                DisplayOrder = updated.DisplayOrder,
                IsPopular = updated.IsPopular,
                Tags = string.IsNullOrEmpty(updated.Tags) 
                    ? new List<string>() 
                    : System.Text.Json.JsonSerializer.Deserialize<List<string>>(updated.Tags) ?? new List<string>(),
                // Note: AvailableVendors, AverageVendorPrice, InStock, StockLevel are calculated via /stats endpoints
                AvailableVendors = 0,
                AverageVendorPrice = null,
                InStock = false,
                StockLevel = null
            };

            _logger.LogInformation("Updated material: {MaterialId}", id);

            return Ok(new ApiResponse<MaterialDto>
            {
                Success = true,
                Message = "Material updated successfully",
                Data = dto
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating material {Id}", id);
            return StatusCode(500, new ApiResponse<MaterialDto>
            {
                Success = false,
                Message = "An error occurred while updating the material",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    /// <summary>
    /// Delete material (Admin only)
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Policy = AuthorizationPolicies.AdminOnly)]
    public async Task<ActionResult<ApiResponse<object>>> DeleteMaterial(Guid id)
    {
        try
        {
            var success = await _materialRepository.DeleteAsync(id);
            if (!success)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Material not found"
                });
            }

            _logger.LogInformation("Deleted material: {MaterialId}", id);

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Material deleted successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting material {Id}", id);
            return StatusCode(500, new ApiResponse<object>
            {
                Success = false,
                Message = "An error occurred while deleting the material",
                Errors = new List<string> { ex.Message }
            });
        }
    }
}