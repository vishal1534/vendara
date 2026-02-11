using CatalogService.Models.DTOs;
using CatalogService.Models.Entities;
using System.Text.Json;

namespace CatalogService.Extensions;

public static class MappingExtensions
{
    public static MaterialDto ToDto(this Material material)
    {
        return new MaterialDto
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
                : JsonSerializer.Deserialize<List<string>>(material.Tags) ?? new List<string>(),
            AvailableVendors = 0,
            AverageVendorPrice = null,
            InStock = false,
            StockLevel = null
        };
    }
    
    public static List<MaterialDto> ToDtos(this IEnumerable<Material> materials)
    {
        return materials.Select(m => m.ToDto()).ToList();
    }
    
    public static LaborCategoryDto ToDto(this LaborCategory laborCategory)
    {
        return new LaborCategoryDto
        {
            Id = laborCategory.Id,
            CategoryId = laborCategory.CategoryId,
            CategoryName = laborCategory.Category?.Name ?? string.Empty,
            Name = laborCategory.Name,
            Description = laborCategory.Description,
            BaseHourlyRate = laborCategory.BaseHourlyRate,
            BaseDailyRate = laborCategory.BaseDailyRate,
            SkillLevel = laborCategory.SkillLevel,
            IconUrl = laborCategory.IconUrl,
            IsActive = laborCategory.IsActive,
            DisplayOrder = laborCategory.DisplayOrder,
            IsPopular = laborCategory.IsPopular,
            Tags = string.IsNullOrEmpty(laborCategory.Tags)
                ? new List<string>()
                : JsonSerializer.Deserialize<List<string>>(laborCategory.Tags) ?? new List<string>(),
            MinimumExperienceYears = laborCategory.MinimumExperienceYears,
            CertificationRequired = laborCategory.CertificationRequired,
            AvailableVendors = 0,
            AverageVendorRate = null
        };
    }
    
    public static List<LaborCategoryDto> ToDtos(this IEnumerable<LaborCategory> laborCategories)
    {
        return laborCategories.Select(l => l.ToDto()).ToList();
    }
    
    public static CategoryDto ToDto(this Category category)
    {
        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            Type = category.Type,
            IconUrl = category.IconUrl,
            ParentCategoryId = category.ParentCategoryId,
            IsActive = category.IsActive,
            DisplayOrder = category.DisplayOrder,
            SubCategoryCount = category.SubCategories?.Count ?? 0
        };
    }
    
    public static List<CategoryDto> ToDtos(this IEnumerable<Category> categories)
    {
        return categories.Select(c => c.ToDto()).ToList();
    }
    
    public static VendorInventoryDto ToDto(this VendorInventory item)
    {
        return new VendorInventoryDto
        {
            Id = item.Id,
            VendorId = item.VendorId,
            MaterialId = item.MaterialId,
            MaterialName = item.Material?.Name ?? string.Empty,
            MaterialUnit = item.Material?.Unit ?? string.Empty,
            VendorPrice = item.VendorPrice,
            StockQuantity = item.StockQuantity,
            MinOrderQuantity = item.MinOrderQuantity,
            MaxOrderQuantity = item.MaxOrderQuantity,
            LeadTimeDays = item.LeadTimeDays,
            IsAvailable = item.IsAvailable,
            LastRestockedAt = item.LastRestockedAt
        };
    }
    
    public static List<VendorInventoryDto> ToDtos(this IEnumerable<VendorInventory> items)
    {
        return items.Select(i => i.ToDto()).ToList();
    }
    
    public static VendorLaborAvailabilityDto ToDto(this VendorLaborAvailability item)
    {
        return new VendorLaborAvailabilityDto
        {
            Id = item.Id,
            VendorId = item.VendorId,
            LaborCategoryId = item.LaborCategoryId,
            LaborCategoryName = item.LaborCategory?.Name ?? string.Empty,
            HourlyRate = item.HourlyRate,
            DailyRate = item.DailyRate,
            AvailableWorkers = item.AvailableWorkers,
            MinBookingHours = item.MinBookingHours,
            IsAvailable = item.IsAvailable,
            LastAvailabilityUpdate = item.LastAvailabilityUpdate
        };
    }
    
    public static List<VendorLaborAvailabilityDto> ToDtos(this IEnumerable<VendorLaborAvailability> items)
    {
        return items.Select(i => i.ToDto()).ToList();
    }
}
