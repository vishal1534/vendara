using CatalogService.Models.Entities;

namespace CatalogService.Models.DTOs;

public class CategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Key { get; set; } = string.Empty;
    public string? Description { get; set; }
    public CategoryType Type { get; set; }
    public int DisplayOrder { get; set; }
    public Guid? ParentCategoryId { get; set; }
    public string? ParentCategoryName { get; set; }
    public string? IconUrl { get; set; }
    public bool IsActive { get; set; }
    public List<CategoryDto>? SubCategories { get; set; }
    
    // Calculated fields
    public int MaterialCount { get; set; }
    public int LaborCount { get; set; }
}

public class CreateCategoryRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Key { get; set; }
    public string? Description { get; set; }
    public CategoryType Type { get; set; }
    public Guid? ParentCategoryId { get; set; }
    public string? IconUrl { get; set; }
    public int DisplayOrder { get; set; } = 0;
}

public class UpdateCategoryRequest
{
    public string? Name { get; set; }
    public string? Key { get; set; }
    public string? Description { get; set; }
    public string? IconUrl { get; set; }
    public bool? IsActive { get; set; }
    public int? DisplayOrder { get; set; }
}

public class CategoryStatsDto
{
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string CategoryKey { get; set; } = string.Empty;
    public CategoryType Type { get; set; }
    public int ItemCount { get; set; }
    public int ActiveItems { get; set; }
    public decimal TotalValue { get; set; }
    public int TotalVendors { get; set; }
}

public class CatalogStatsDto
{
    public int TotalMaterials { get; set; }
    public int ActiveMaterials { get; set; }
    public int TotalCategories { get; set; }
    public decimal TotalMaterialValue { get; set; }
    public int TotalLaborServices { get; set; }
    public int ActiveLaborServices { get; set; }
    public int TotalLaborWorkers { get; set; }
    public decimal AverageLaborRate { get; set; }
    public List<CategoryStatsDto> TopCategories { get; set; } = new();
}