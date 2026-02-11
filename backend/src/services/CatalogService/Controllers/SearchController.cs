using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.ComponentModel.DataAnnotations;
using CatalogService.Data;
using CatalogService.Models.DTOs;
using CatalogService.Models.Entities;
using CatalogService.Models.Configuration;
using CatalogService.Models.Validation;
using CatalogService.Extensions;
using RealServ.Shared.Application.Models;

namespace CatalogService.Controllers;

/// <summary>
/// Advanced Search and Filtering
/// Comprehensive search across materials and labor services with multiple filters
/// </summary>
[ApiController]
[Route("api/v1/search")]
[AllowAnonymous] // Public search endpoints
public class SearchController : ControllerBase
{
    private readonly CatalogServiceDbContext _context;
    private readonly ILogger<SearchController> _logger;
    private readonly PaginationSettings _paginationSettings;

    public SearchController(
        CatalogServiceDbContext context,
        ILogger<SearchController> logger,
        IOptions<PaginationSettings> paginationSettings)
    {
        _context = context;
        _logger = logger;
        _paginationSettings = paginationSettings.Value;
    }

    /// <summary>
    /// Advanced material search with filters
    /// </summary>
    [HttpGet("materials")]
    public async Task<ActionResult<ApiResponse<SearchResultsDto<MaterialDto>>>> SearchMaterials(
        [FromQuery, MaxLength(100)] string? searchTerm = null,
        [FromQuery] Guid? categoryId = null,
        [FromQuery, Range(0, 1000000)] decimal? minPrice = null,
        [FromQuery, Range(0, 1000000)] decimal? maxPrice = null,
        [FromQuery, MaxLength(100)] string? brand = null,
        [FromQuery] bool? isActive = true,
        [FromQuery] bool? isPopular = null,
        [FromQuery, MaxLength(500)] string? tags = null,
        [FromQuery, Range(1, int.MaxValue)] int page = 1,
        [FromQuery, Range(1, 100)] int pageSize = 20,
        [FromQuery, MaxLength(50)] string sortBy = "name",
        [FromQuery, MaxLength(4)] string sortOrder = "asc")
    {
        try
        {
            // Validate and sanitize inputs
            page = _paginationSettings.ValidatePage(page);
            pageSize = _paginationSettings.ValidatePageSize(pageSize);
            searchTerm = SearchQueryValidator.SanitizeSearchTerm(searchTerm);
            
            // Validate price range
            if (minPrice.HasValue && maxPrice.HasValue && minPrice > maxPrice)
            {
                return BadRequest(new ApiResponse<SearchResultsDto<MaterialDto>>
                {
                    Success = false,
                    Message = "Minimum price cannot be greater than maximum price"
                });
            }

            var query = _context.Materials
                .Include(m => m.Category)
                .AsQueryable();

            // Text search with sanitized input
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(m => 
                    EF.Functions.ILike(m.Name, $"%{searchTerm}%") ||
                    (m.Description != null && EF.Functions.ILike(m.Description, $"%{searchTerm}%")) ||
                    (m.Brand != null && EF.Functions.ILike(m.Brand, $"%{searchTerm}%")) ||
                    (m.Sku != null && EF.Functions.ILike(m.Sku, $"%{searchTerm}%")));
            }

            // Category filter
            if (categoryId.HasValue)
            {
                query = query.Where(m => m.CategoryId == categoryId.Value);
            }

            // Price range filter
            if (minPrice.HasValue)
            {
                query = query.Where(m => m.BasePrice >= minPrice.Value);
            }
            if (maxPrice.HasValue)
            {
                query = query.Where(m => m.BasePrice <= maxPrice.Value);
            }

            // Brand filter
            if (!string.IsNullOrWhiteSpace(brand))
            {
                query = query.Where(m => m.Brand != null && EF.Functions.ILike(m.Brand, $"%{brand}%"));
            }

            // Status filters
            if (isActive.HasValue)
            {
                query = query.Where(m => m.IsActive == isActive.Value);
            }
            if (isPopular.HasValue)
            {
                query = query.Where(m => m.IsPopular == isPopular.Value);
            }

            // Tags filter
            if (!string.IsNullOrWhiteSpace(tags))
            {
                var tagList = tags.Split(',').Select(t => t.Trim().ToLower()).ToList();
                query = query.Where(m => m.Tags != null && tagList.Any(tag => m.Tags.ToLower().Contains(tag)));
            }

            // Get total count before pagination
            var totalCount = await query.CountAsync();

            // Sorting
            query = sortBy.ToLower() switch
            {
                "price" => sortOrder.ToLower() == "desc" 
                    ? query.OrderByDescending(m => m.BasePrice) 
                    : query.OrderBy(m => m.BasePrice),
                "displayorder" => sortOrder.ToLower() == "desc" 
                    ? query.OrderByDescending(m => m.DisplayOrder) 
                    : query.OrderBy(m => m.DisplayOrder),
                _ => sortOrder.ToLower() == "desc" 
                    ? query.OrderByDescending(m => m.Name) 
                    : query.OrderBy(m => m.Name)
            };

            // Pagination
            var materials = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var dtos = materials.Select(m => new MaterialDto
            {
                Id = m.Id,
                CategoryId = m.CategoryId,
                CategoryName = m.Category?.Name ?? "",
                Name = m.Name,
                Description = m.Description,
                Sku = m.Sku,
                BasePrice = m.BasePrice,
                Unit = m.Unit,
                MinOrderQuantity = m.MinOrderQuantity,
                MaxOrderQuantity = m.MaxOrderQuantity,
                ImageUrl = m.ImageUrl,
                Brand = m.Brand,
                Specifications = m.Specifications,
                HsnCode = m.HsnCode,
                GstPercentage = m.GstPercentage,
                IsActive = m.IsActive,
                DisplayOrder = m.DisplayOrder,
                IsPopular = m.IsPopular,
                Tags = string.IsNullOrEmpty(m.Tags) 
                    ? new List<string>() 
                    : System.Text.Json.JsonSerializer.Deserialize<List<string>>(m.Tags) ?? new List<string>(),
                AvailableVendors = 0,
                AverageVendorPrice = null,
                InStock = false,
                StockLevel = null
            }).ToList();

            var result = new SearchResultsDto<MaterialDto>
            {
                Results = dtos,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            };

            return Ok(new ApiResponse<SearchResultsDto<MaterialDto>>
            {
                Success = true,
                Message = $"Found {totalCount} materials matching criteria",
                Data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching materials");
            return StatusCode(500, new ApiResponse<SearchResultsDto<MaterialDto>>
            {
                Success = false,
                Message = "An error occurred while searching materials",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    /// <summary>
    /// Advanced labor category search with filters
    /// </summary>
    [HttpGet("labor-categories")]
    public async Task<ActionResult<ApiResponse<SearchResultsDto<LaborCategoryDto>>>> SearchLaborCategories(
        [FromQuery, MaxLength(100)] string? searchTerm = null,
        [FromQuery] Guid? categoryId = null,
        [FromQuery, Range(0, 1000000)] decimal? minHourlyRate = null,
        [FromQuery, Range(0, 1000000)] decimal? maxHourlyRate = null,
        [FromQuery, Range(0, 1000000)] decimal? minDailyRate = null,
        [FromQuery, Range(0, 1000000)] decimal? maxDailyRate = null,
        [FromQuery] SkillLevel? skillLevel = null,
        [FromQuery] bool? isActive = true,
        [FromQuery] bool? isPopular = null,
        [FromQuery] bool? certificationRequired = null,
        [FromQuery, MaxLength(500)] string? tags = null,
        [FromQuery, Range(1, int.MaxValue)] int page = 1,
        [FromQuery, Range(1, 100)] int pageSize = 20,
        [FromQuery, MaxLength(50)] string sortBy = "name",
        [FromQuery, MaxLength(4)] string sortOrder = "asc")
    {
        try
        {
            // Validate and sanitize inputs
            page = _paginationSettings.ValidatePage(page);
            pageSize = _paginationSettings.ValidatePageSize(pageSize);
            searchTerm = SearchQueryValidator.SanitizeSearchTerm(searchTerm);
            
            // Validate rate ranges
            if (minHourlyRate.HasValue && maxHourlyRate.HasValue && minHourlyRate > maxHourlyRate)
            {
                return BadRequest(new ApiResponse<SearchResultsDto<LaborCategoryDto>>
                {
                    Success = false,
                    Message = "Minimum hourly rate cannot be greater than maximum hourly rate"
                });
            }
            if (minDailyRate.HasValue && maxDailyRate.HasValue && minDailyRate > maxDailyRate)
            {
                return BadRequest(new ApiResponse<SearchResultsDto<LaborCategoryDto>>
                {
                    Success = false,
                    Message = "Minimum daily rate cannot be greater than maximum daily rate"
                });
            }

            var query = _context.LaborCategories
                .Include(l => l.Category)
                .AsQueryable();

            // Text search with sanitized input
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(l => 
                    EF.Functions.ILike(l.Name, $"%{searchTerm}%") ||
                    (l.Description != null && EF.Functions.ILike(l.Description, $"%{searchTerm}%")));
            }

            // Category filter
            if (categoryId.HasValue)
            {
                query = query.Where(l => l.CategoryId == categoryId.Value);
            }

            // Rate range filters
            if (minHourlyRate.HasValue)
            {
                query = query.Where(l => l.BaseHourlyRate >= minHourlyRate.Value);
            }
            if (maxHourlyRate.HasValue)
            {
                query = query.Where(l => l.BaseHourlyRate <= maxHourlyRate.Value);
            }
            if (minDailyRate.HasValue)
            {
                query = query.Where(l => l.BaseDailyRate >= minDailyRate.Value);
            }
            if (maxDailyRate.HasValue)
            {
                query = query.Where(l => l.BaseDailyRate <= maxDailyRate.Value);
            }

            // Skill level filter
            if (skillLevel.HasValue)
            {
                query = query.Where(l => l.SkillLevel == skillLevel.Value);
            }

            // Status filters
            if (isActive.HasValue)
            {
                query = query.Where(l => l.IsActive == isActive.Value);
            }
            if (isPopular.HasValue)
            {
                query = query.Where(l => l.IsPopular == isPopular.Value);
            }
            if (certificationRequired.HasValue)
            {
                query = query.Where(l => l.CertificationRequired == certificationRequired.Value);
            }

            // Tags filter
            if (!string.IsNullOrWhiteSpace(tags))
            {
                var tagList = tags.Split(',').Select(t => t.Trim().ToLower()).ToList();
                query = query.Where(l => l.Tags != null && tagList.Any(tag => l.Tags.ToLower().Contains(tag)));
            }

            // Get total count before pagination
            var totalCount = await query.CountAsync();

            // Sorting
            query = sortBy.ToLower() switch
            {
                "hourlyrate" => sortOrder.ToLower() == "desc" 
                    ? query.OrderByDescending(l => l.BaseHourlyRate) 
                    : query.OrderBy(l => l.BaseHourlyRate),
                "dailyrate" => sortOrder.ToLower() == "desc" 
                    ? query.OrderByDescending(l => l.BaseDailyRate) 
                    : query.OrderBy(l => l.BaseDailyRate),
                "displayorder" => sortOrder.ToLower() == "desc" 
                    ? query.OrderByDescending(l => l.DisplayOrder) 
                    : query.OrderBy(l => l.DisplayOrder),
                _ => sortOrder.ToLower() == "desc" 
                    ? query.OrderByDescending(l => l.Name) 
                    : query.OrderBy(l => l.Name)
            };

            // Pagination
            var laborCategories = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var dtos = laborCategories.Select(l => new LaborCategoryDto
            {
                Id = l.Id,
                CategoryId = l.CategoryId,
                CategoryName = l.Category?.Name ?? "",
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
                AvailableVendors = 0,
                AverageVendorRate = null
            }).ToList();

            var result = new SearchResultsDto<LaborCategoryDto>
            {
                Results = dtos,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            };

            return Ok(new ApiResponse<SearchResultsDto<LaborCategoryDto>>
            {
                Success = true,
                Message = $"Found {totalCount} labor categories matching criteria",
                Data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching labor categories");
            return StatusCode(500, new ApiResponse<SearchResultsDto<LaborCategoryDto>>
            {
                Success = false,
                Message = "An error occurred while searching labor categories",
                Errors = new List<string> { ex.Message }
            });
        }
    }

    /// <summary>
    /// Global search across materials and labor categories
    /// </summary>
    [HttpGet("global")]
    public async Task<ActionResult<ApiResponse<GlobalSearchResultDto>>> GlobalSearch(
        [FromQuery] string searchTerm,
        [FromQuery] int limit = 10)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return BadRequest(new ApiResponse<GlobalSearchResultDto>
                {
                    Success = false,
                    Message = "Search term is required"
                });
            }

            var lowerTerm = searchTerm.ToLower();

            // Search materials
            var materials = await _context.Materials
                .Include(m => m.Category)
                .Where(m => m.IsActive && (
                    m.Name.ToLower().Contains(lowerTerm) ||
                    (m.Description != null && m.Description.ToLower().Contains(lowerTerm)) ||
                    (m.Brand != null && m.Brand.ToLower().Contains(lowerTerm))))
                .Take(limit)
                .Select(m => new MaterialDto
                {
                    Id = m.Id,
                    CategoryId = m.CategoryId,
                    CategoryName = m.Category!.Name,
                    Name = m.Name,
                    Description = m.Description,
                    BasePrice = m.BasePrice,
                    Unit = m.Unit,
                    ImageUrl = m.ImageUrl,
                    Brand = m.Brand,
                    IsActive = m.IsActive,
                    IsPopular = m.IsPopular
                })
                .ToListAsync();

            // Search labor categories
            var laborCategories = await _context.LaborCategories
                .Include(l => l.Category)
                .Where(l => l.IsActive && (
                    l.Name.ToLower().Contains(lowerTerm) ||
                    (l.Description != null && l.Description.ToLower().Contains(lowerTerm))))
                .Take(limit)
                .Select(l => new LaborCategoryDto
                {
                    Id = l.Id,
                    CategoryId = l.CategoryId,
                    CategoryName = l.Category!.Name,
                    Name = l.Name,
                    Description = l.Description,
                    BaseHourlyRate = l.BaseHourlyRate,
                    BaseDailyRate = l.BaseDailyRate,
                    SkillLevel = l.SkillLevel,
                    IsActive = l.IsActive,
                    IsPopular = l.IsPopular
                })
                .ToListAsync();

            var result = new GlobalSearchResultDto
            {
                Materials = materials,
                LaborCategories = laborCategories,
                TotalResults = materials.Count + laborCategories.Count
            };

            return Ok(new ApiResponse<GlobalSearchResultDto>
            {
                Success = true,
                Message = $"Found {result.TotalResults} results",
                Data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in global search");
            return StatusCode(500, new ApiResponse<GlobalSearchResultDto>
            {
                Success = false,
                Message = "An error occurred during search",
                Errors = new List<string> { ex.Message }
            });
        }
    }
}

public class SearchResultsDto<T>
{
    public List<T> Results { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}

public class GlobalSearchResultDto
{
    public List<MaterialDto> Materials { get; set; } = new();
    public List<LaborCategoryDto> LaborCategories { get; set; } = new();
    public int TotalResults { get; set; }
}