using Microsoft.AspNetCore.Mvc;
using CatalogService.Repositories.Interfaces;
using CatalogService.Repositories;
using CatalogService.Models.DTOs;
using CatalogService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using CatalogService.Data;

namespace CatalogService.Controllers;

/// <summary>
/// Catalog Statistics and Aggregations
/// Provides calculated fields, statistics, and analytics
/// </summary>
[ApiController]
[Route("api/v1/catalog/stats")]
public class CatalogStatsController : ControllerBase
{
    private readonly CatalogServiceDbContext _context;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IMaterialRepository _materialRepository;
    private readonly ILaborRepository _laborRepository;
    private readonly IVendorInventoryRepository _vendorInventoryRepository;
    private readonly IVendorLaborAvailabilityRepository _vendorLaborRepository;
    private readonly ILogger<CatalogStatsController> _logger;

    public CatalogStatsController(
        CatalogServiceDbContext context,
        ICategoryRepository categoryRepository,
        IMaterialRepository materialRepository,
        ILaborRepository laborRepository,
        IVendorInventoryRepository vendorInventoryRepository,
        IVendorLaborAvailabilityRepository vendorLaborRepository,
        ILogger<CatalogStatsController> logger)
    {
        _context = context;
        _categoryRepository = categoryRepository;
        _materialRepository = materialRepository;
        _laborRepository = laborRepository;
        _vendorInventoryRepository = vendorInventoryRepository;
        _vendorLaborRepository = vendorLaborRepository;
        _logger = logger;
    }

    /// <summary>
    /// Get overall catalog statistics
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<CatalogStatsDto>> GetCatalogStats()
    {
        try
        {
            var materials = await _materialRepository.GetAllAsync(includeInactive: true);
            var laborServices = await _laborRepository.GetAllAsync(includeInactive: true);
            var categories = await _categoryRepository.GetAllAsync(includeInactive: true);

            var stats = new CatalogStatsDto
            {
                TotalMaterials = materials.Count,
                ActiveMaterials = materials.Count(m => m.IsActive),
                TotalCategories = categories.Count,
                TotalMaterialValue = materials.Where(m => m.IsActive).Sum(m => m.BasePrice),
                TotalLaborServices = laborServices.Count,
                ActiveLaborServices = laborServices.Count(l => l.IsActive),
                TotalLaborWorkers = await _context.VendorLaborAvailabilities
                    .Where(vla => vla.IsAvailable)
                    .SumAsync(vla => vla.AvailableWorkers),
                AverageLaborRate = laborServices.Any() 
                    ? laborServices.Average(l => l.BaseDailyRate) 
                    : 0
            };

            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting catalog statistics");
            return StatusCode(500, new { error = "Failed to retrieve statistics" });
        }
    }

    /// <summary>
    /// Get category statistics with item counts
    /// </summary>
    [HttpGet("categories")]
    public async Task<ActionResult<List<CategoryStatsDto>>> GetCategoryStats()
    {
        try
        {
            var categories = await _categoryRepository.GetAllAsync(includeInactive: false);
            var categoryStats = new List<CategoryStatsDto>();

            foreach (var category in categories)
            {
                int itemCount = 0;
                int activeItems = 0;
                decimal totalValue = 0;
                int totalVendors = 0;

                if (category.Type == CategoryType.Material)
                {
                    var materials = await _materialRepository.GetByCategoryAsync(category.Id, includeInactive: true);
                    itemCount = materials.Count;
                    activeItems = materials.Count(m => m.IsActive);
                    totalValue = materials.Where(m => m.IsActive).Sum(m => m.BasePrice);
                    
                    // Count unique vendors for this category's materials
                    foreach (var material in materials)
                    {
                        var vendorCount = await _context.VendorInventories
                            .Where(vi => vi.MaterialId == material.Id && vi.IsAvailable)
                            .Select(vi => vi.VendorId)
                            .Distinct()
                            .CountAsync();
                        totalVendors += vendorCount;
                    }
                }
                else if (category.Type == CategoryType.Labor)
                {
                    var laborServices = await _laborRepository.GetByCategoryAsync(category.Id, includeInactive: true);
                    itemCount = laborServices.Count;
                    activeItems = laborServices.Count(l => l.IsActive);
                    totalValue = laborServices.Where(l => l.IsActive).Sum(l => l.BaseDailyRate);
                    
                    // Count unique vendors for this category's labor services
                    foreach (var labor in laborServices)
                    {
                        var vendorCount = await _context.VendorLaborAvailabilities
                            .Where(vla => vla.LaborCategoryId == labor.Id && vla.IsAvailable)
                            .Select(vla => vla.VendorId)
                            .Distinct()
                            .CountAsync();
                        totalVendors += vendorCount;
                    }
                }

                categoryStats.Add(new CategoryStatsDto
                {
                    CategoryId = category.Id,
                    CategoryName = category.Name,
                    CategoryKey = category.Key,
                    Type = category.Type,
                    ItemCount = itemCount,
                    ActiveItems = activeItems,
                    TotalValue = totalValue,
                    TotalVendors = totalVendors
                });
            }

            return Ok(categoryStats.OrderByDescending(cs => cs.ItemCount).ToList());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting category statistics");
            return StatusCode(500, new { error = "Failed to retrieve category statistics" });
        }
    }

    /// <summary>
    /// Get material with calculated vendor statistics
    /// </summary>
    [HttpGet("materials/{id}/with-stats")]
    public async Task<ActionResult<MaterialDto>> GetMaterialWithStats(Guid id)
    {
        try
        {
            var material = await _materialRepository.GetByIdAsync(id);
            if (material == null)
            {
                return NotFound(new { error = "Material not found" });
            }

            var vendorInventories = await _vendorInventoryRepository.GetByMaterialAsync(id, availableOnly: true);
            
            var dto = new MaterialDto
            {
                Id = material.Id,
                CategoryId = material.CategoryId,
                CategoryName = material.Category?.Name ?? "",
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
                
                // Calculated fields
                AvailableVendors = vendorInventories.Select(vi => vi.VendorId).Distinct().Count(),
                AverageVendorPrice = vendorInventories.Any() 
                    ? vendorInventories.Average(vi => vi.VendorPrice) 
                    : null,
                InStock = vendorInventories.Any(vi => vi.StockQuantity > 0),
                StockLevel = vendorInventories.Any() 
                    ? (int)vendorInventories.Sum(vi => vi.StockQuantity) 
                    : null
            };

            return Ok(dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting material with stats for {MaterialId}", id);
            return StatusCode(500, new { error = "Failed to retrieve material statistics" });
        }
    }

    /// <summary>
    /// Get labor service with calculated vendor statistics
    /// </summary>
    [HttpGet("labor/{id}/with-stats")]
    public async Task<ActionResult<LaborCategoryDto>> GetLaborWithStats(Guid id)
    {
        try
        {
            var labor = await _laborRepository.GetByIdAsync(id);
            if (labor == null)
            {
                return NotFound(new { error = "Labor service not found" });
            }

            var vendorAvailabilities = await _vendorLaborRepository.GetByLaborCategoryAsync(id, availableOnly: true);
            
            var dto = new LaborCategoryDto
            {
                Id = labor.Id,
                CategoryId = labor.CategoryId,
                CategoryName = labor.Category?.Name ?? "",
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
                
                // Calculated fields
                AvailableVendors = vendorAvailabilities.Select(vla => vla.VendorId).Distinct().Count(),
                AverageVendorRate = vendorAvailabilities.Any() 
                    ? vendorAvailabilities.Average(vla => vla.DailyRate) 
                    : null
            };

            return Ok(dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting labor with stats for {LaborId}", id);
            return StatusCode(500, new { error = "Failed to retrieve labor statistics" });
        }
    }

    /// <summary>
    /// Get popular materials
    /// </summary>
    [HttpGet("materials/popular")]
    public async Task<ActionResult<List<MaterialDto>>> GetPopularMaterials([FromQuery] int limit = 10)
    {
        try
        {
            var materials = await _context.Materials
                .Include(m => m.Category)
                .Where(m => m.IsActive && m.IsPopular)
                .OrderBy(m => m.DisplayOrder)
                .Take(limit)
                .ToListAsync();

            var dtos = new List<MaterialDto>();
            foreach (var material in materials)
            {
                var vendorInventories = await _vendorInventoryRepository.GetByMaterialAsync(material.Id, availableOnly: true);
                
                dtos.Add(new MaterialDto
                {
                    Id = material.Id,
                    CategoryId = material.CategoryId,
                    CategoryName = material.Category?.Name ?? "",
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
                    AvailableVendors = vendorInventories.Select(vi => vi.VendorId).Distinct().Count(),
                    AverageVendorPrice = vendorInventories.Any() ? vendorInventories.Average(vi => vi.VendorPrice) : null,
                    InStock = vendorInventories.Any(vi => vi.StockQuantity > 0),
                    StockLevel = vendorInventories.Any() ? (int)vendorInventories.Sum(vi => vi.StockQuantity) : null
                });
            }

            return Ok(dtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting popular materials");
            return StatusCode(500, new { error = "Failed to retrieve popular materials" });
        }
    }

    /// <summary>
    /// Get popular labor services
    /// </summary>
    [HttpGet("labor/popular")]
    public async Task<ActionResult<List<LaborCategoryDto>>> GetPopularLaborServices([FromQuery] int limit = 10)
    {
        try
        {
            var laborServices = await _context.LaborCategories
                .Include(l => l.Category)
                .Where(l => l.IsActive && l.IsPopular)
                .OrderBy(l => l.DisplayOrder)
                .Take(limit)
                .ToListAsync();

            var dtos = new List<LaborCategoryDto>();
            foreach (var labor in laborServices)
            {
                var vendorAvailabilities = await _vendorLaborRepository.GetByLaborCategoryAsync(labor.Id, availableOnly: true);
                
                dtos.Add(new LaborCategoryDto
                {
                    Id = labor.Id,
                    CategoryId = labor.CategoryId,
                    CategoryName = labor.Category?.Name ?? "",
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
                    AvailableVendors = vendorAvailabilities.Select(vla => vla.VendorId).Distinct().Count(),
                    AverageVendorRate = vendorAvailabilities.Any() ? vendorAvailabilities.Average(vla => vla.DailyRate) : null
                });
            }

            return Ok(dtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting popular labor services");
            return StatusCode(500, new { error = "Failed to retrieve popular labor services" });
        }
    }
}
