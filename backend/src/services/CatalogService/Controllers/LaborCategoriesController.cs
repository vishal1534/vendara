using CatalogService.Models.DTOs;
using CatalogService.Models.Entities;
using CatalogService.Repositories;
using Microsoft.AspNetCore.Mvc;
using RealServ.Shared.Application.Models;

namespace CatalogService.Controllers;

/// <summary>
/// Labor Categories Management (Admin)
/// CRUD operations for labor service categories
/// </summary>
[ApiController]
[Route("api/v1/labor-categories")]
public class LaborCategoriesController : ControllerBase
{
    private readonly ILaborRepository _laborRepository;
    private readonly ILogger<LaborCategoriesController> _logger;

    public LaborCategoriesController(
        ILaborRepository laborRepository,
        ILogger<LaborCategoriesController> logger)
    {
        _laborRepository = laborRepository;
        _logger = logger;
    }

    /// <summary>
    /// Get all labor categories
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<LaborCategoryDto>>>> GetLaborCategories(
        [FromQuery] Guid? categoryId = null,
        [FromQuery] bool includeInactive = false)
    {
        try
        {
            List<LaborCategory> laborCategories;

            if (categoryId.HasValue)
            {
                laborCategories = await _laborRepository.GetByCategoryAsync(categoryId.Value, includeInactive);
            }
            else
            {
                laborCategories = await _laborRepository.GetAllAsync(includeInactive);
            }

            var dtos = laborCategories.Select(l => new LaborCategoryDto
            {
                Id = l.Id,
                CategoryId = l.CategoryId,
                CategoryName = l.Category?.Name ?? string.Empty,
                Name = l.Name,
                Description = l.Description,
                BaseHourlyRate = l.BaseHourlyRate,
                BaseDailyRate = l.BaseDailyRate,
                SkillLevel = l.SkillLevel,
                IconUrl = l.IconUrl,
                IsActive = l.IsActive,
                DisplayOrder = l.DisplayOrder,
                IsPopular = l.IsPopular,
                Tags = string.IsNullOrEmpty(l.Tags) 
                    ? new List<string>() 
                    : System.Text.Json.JsonSerializer.Deserialize<List<string>>(l.Tags) ?? new List<string>(),
                MinimumExperienceYears = l.MinimumExperienceYears,
                CertificationRequired = l.CertificationRequired,
                // Note: AvailableVendors and AverageVendorRate are calculated via /stats endpoints
                AvailableVendors = 0,
                AverageVendorRate = null
            }).ToList();

            return Ok(new ApiResponse<List<LaborCategoryDto>>
            {
                Success = true,
                Message = $"Retrieved {dtos.Count} labor categories",
                Data = dtos
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving labor categories");
            return StatusCode(500, new ApiResponse<List<LaborCategoryDto>>
            {
                Success = false,
                Message = "An error occurred while retrieving labor categories",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    /// <summary>
    /// Get labor category by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<LaborCategoryDto>>> GetLaborCategory(Guid id)
    {
        try
        {
            var labor = await _laborRepository.GetByIdAsync(id);
            if (labor == null)
            {
                return NotFound(new ApiResponse<LaborCategoryDto>
                {
                    Success = false,
                    Message = "Labor category not found"
                });
            }

            var dto = new LaborCategoryDto
            {
                Id = labor.Id,
                CategoryId = labor.CategoryId,
                CategoryName = labor.Category?.Name ?? string.Empty,
                Name = labor.Name,
                Description = labor.Description,
                BaseHourlyRate = labor.BaseHourlyRate,
                BaseDailyRate = labor.BaseDailyRate,
                SkillLevel = labor.SkillLevel,
                IconUrl = labor.IconUrl,
                IsActive = labor.IsActive,
                DisplayOrder = labor.DisplayOrder,
                IsPopular = labor.IsPopular,
                Tags = string.IsNullOrEmpty(labor.Tags) 
                    ? new List<string>() 
                    : System.Text.Json.JsonSerializer.Deserialize<List<string>>(labor.Tags) ?? new List<string>(),
                MinimumExperienceYears = labor.MinimumExperienceYears,
                CertificationRequired = labor.CertificationRequired,
                AvailableVendors = 0,
                AverageVendorRate = null
            };

            return Ok(new ApiResponse<LaborCategoryDto>
            {
                Success = true,
                Message = "Labor category retrieved successfully",
                Data = dto
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving labor category {LaborCategoryId}", id);
            return StatusCode(500, new ApiResponse<LaborCategoryDto>
            {
                Success = false,
                Message = "An error occurred while retrieving the labor category",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    /// <summary>
    /// Create a new labor category
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<LaborCategoryDto>>> CreateLaborCategory(
        [FromBody] CreateLaborCategoryRequest request)
    {
        try
        {
            var labor = new LaborCategory
            {
                CategoryId = request.CategoryId,
                Name = request.Name,
                Description = request.Description,
                BaseHourlyRate = request.BaseHourlyRate,
                BaseDailyRate = request.BaseDailyRate,
                SkillLevel = request.SkillLevel,
                IconUrl = request.IconUrl,
                DisplayOrder = request.DisplayOrder,
                IsActive = true,
                IsPopular = request.IsPopular,
                MinimumExperienceYears = request.MinimumExperienceYears,
                CertificationRequired = request.CertificationRequired,
                Tags = request.Tags.Any() 
                    ? System.Text.Json.JsonSerializer.Serialize(request.Tags) 
                    : null
            };

            var created = await _laborRepository.CreateAsync(labor);

            var dto = new LaborCategoryDto
            {
                Id = created.Id,
                CategoryId = created.CategoryId,
                Name = created.Name,
                Description = created.Description,
                BaseHourlyRate = created.BaseHourlyRate,
                BaseDailyRate = created.BaseDailyRate,
                SkillLevel = created.SkillLevel,
                IconUrl = created.IconUrl,
                IsActive = created.IsActive,
                DisplayOrder = created.DisplayOrder,
                IsPopular = created.IsPopular,
                Tags = request.Tags,
                MinimumExperienceYears = created.MinimumExperienceYears,
                CertificationRequired = created.CertificationRequired,
                AvailableVendors = 0,
                AverageVendorRate = null
            };

            return CreatedAtAction(
                nameof(GetLaborCategory),
                new { id = created.Id },
                new ApiResponse<LaborCategoryDto>
                {
                    Success = true,
                    Message = "Labor category created successfully",
                    Data = dto
                });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating labor category");
            return StatusCode(500, new ApiResponse<LaborCategoryDto>
            {
                Success = false,
                Message = "An error occurred while creating the labor category",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    /// <summary>
    /// Update an existing labor category
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<LaborCategoryDto>>> UpdateLaborCategory(
        Guid id,
        [FromBody] UpdateLaborCategoryRequest request)
    {
        try
        {
            var labor = await _laborRepository.GetByIdAsync(id);
            if (labor == null)
            {
                return NotFound(new ApiResponse<LaborCategoryDto>
                {
                    Success = false,
                    Message = "Labor category not found"
                });
            }

            // Update fields
            if (request.Name != null) labor.Name = request.Name;
            if (request.Description != null) labor.Description = request.Description;
            if (request.BaseHourlyRate.HasValue) labor.BaseHourlyRate = request.BaseHourlyRate.Value;
            if (request.BaseDailyRate.HasValue) labor.BaseDailyRate = request.BaseDailyRate.Value;
            if (request.SkillLevel.HasValue) labor.SkillLevel = request.SkillLevel.Value;
            if (request.IconUrl != null) labor.IconUrl = request.IconUrl;
            if (request.IsActive.HasValue) labor.IsActive = request.IsActive.Value;
            if (request.DisplayOrder.HasValue) labor.DisplayOrder = request.DisplayOrder.Value;
            if (request.IsPopular.HasValue) labor.IsPopular = request.IsPopular.Value;
            if (request.MinimumExperienceYears.HasValue) labor.MinimumExperienceYears = request.MinimumExperienceYears;
            if (request.CertificationRequired.HasValue) labor.CertificationRequired = request.CertificationRequired.Value;
            if (request.Tags != null && request.Tags.Any()) labor.Tags = System.Text.Json.JsonSerializer.Serialize(request.Tags);

            var updated = await _laborRepository.UpdateAsync(labor);

            var dto = new LaborCategoryDto
            {
                Id = updated.Id,
                CategoryId = updated.CategoryId,
                CategoryName = updated.Category?.Name ?? string.Empty,
                Name = updated.Name,
                Description = updated.Description,
                BaseHourlyRate = updated.BaseHourlyRate,
                BaseDailyRate = updated.BaseDailyRate,
                SkillLevel = updated.SkillLevel,
                IconUrl = updated.IconUrl,
                IsActive = updated.IsActive,
                DisplayOrder = updated.DisplayOrder,
                IsPopular = updated.IsPopular,
                Tags = string.IsNullOrEmpty(updated.Tags) 
                    ? new List<string>() 
                    : System.Text.Json.JsonSerializer.Deserialize<List<string>>(updated.Tags) ?? new List<string>(),
                MinimumExperienceYears = updated.MinimumExperienceYears,
                CertificationRequired = updated.CertificationRequired,
                AvailableVendors = 0,
                AverageVendorRate = null
            };

            return Ok(new ApiResponse<LaborCategoryDto>
            {
                Success = true,
                Message = "Labor category updated successfully",
                Data = dto
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating labor category {LaborCategoryId}", id);
            return StatusCode(500, new ApiResponse<LaborCategoryDto>
            {
                Success = false,
                Message = "An error occurred while updating the labor category",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    /// <summary>
    /// Delete a labor category
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteLaborCategory(Guid id)
    {
        try
        {
            var labor = await _laborRepository.GetByIdAsync(id);
            if (labor == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Labor category not found"
                });
            }

            await _laborRepository.DeleteAsync(id);

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Labor category deleted successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting labor category {LaborCategoryId}", id);
            return StatusCode(500, new ApiResponse<object>
            {
                Success = false,
                Message = "An error occurred while deleting the labor category",
                Errors = new List<string> { ex.Message }
            });
        }
    }
}
