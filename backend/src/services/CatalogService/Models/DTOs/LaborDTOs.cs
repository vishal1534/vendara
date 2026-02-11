using CatalogService.Models.Entities;

namespace CatalogService.Models.DTOs;

public class LaborCategoryDto
{
    public Guid Id { get; set; }
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal BaseHourlyRate { get; set; }
    public decimal BaseDailyRate { get; set; }
    public SkillLevel SkillLevel { get; set; }
    public string? IconUrl { get; set; }
    public bool IsActive { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsPopular { get; set; }
    public List<string> Tags { get; set; } = new();
    public int? MinimumExperienceYears { get; set; }
    public bool CertificationRequired { get; set; }
    
    // Calculated fields
    public int AvailableVendors { get; set; }
    public decimal? AverageVendorRate { get; set; }
}

public class CreateLaborCategoryRequest
{
    public Guid CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal BaseHourlyRate { get; set; }
    public decimal BaseDailyRate { get; set; }
    public SkillLevel SkillLevel { get; set; } = SkillLevel.Skilled;
    public string? IconUrl { get; set; }
    public int DisplayOrder { get; set; } = 0;
    public bool IsPopular { get; set; } = false;
    public List<string> Tags { get; set; } = new();
    public int? MinimumExperienceYears { get; set; }
    public bool CertificationRequired { get; set; } = false;
}

public class UpdateLaborCategoryRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal? BaseHourlyRate { get; set; }
    public decimal? BaseDailyRate { get; set; }
    public SkillLevel? SkillLevel { get; set; }
    public string? IconUrl { get; set; }
    public bool? IsActive { get; set; }
    public int? DisplayOrder { get; set; }
    public bool? IsPopular { get; set; }
    public List<string>? Tags { get; set; }
    public int? MinimumExperienceYears { get; set; }
    public bool? CertificationRequired { get; set; }
}