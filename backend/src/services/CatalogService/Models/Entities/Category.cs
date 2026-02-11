using RealServ.Shared.Domain.Entities;

namespace CatalogService.Models.Entities;

/// <summary>
/// Category for materials or labor services
/// </summary>
public class Category : BaseEntity
{
    /// <summary>
    /// Category name (e.g., "Cement", "Bricks", "Masonry Services")
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// URL-safe key/slug for the category (e.g., "cement", "masonry-services")
    /// </summary>
    public string Key { get; set; } = string.Empty;

    /// <summary>
    /// Category description
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Category type: Material or Labor
    /// </summary>
    public CategoryType Type { get; set; }

    /// <summary>
    /// Display order for UI
    /// </summary>
    public int DisplayOrder { get; set; }

    /// <summary>
    /// Parent category ID for hierarchical categories (nullable for root categories)
    /// </summary>
    public Guid? ParentCategoryId { get; set; }

    /// <summary>
    /// Icon URL or identifier
    /// </summary>
    public string? IconUrl { get; set; }

    /// <summary>
    /// Is this category active?
    /// </summary>
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public Category? ParentCategory { get; set; }
    public ICollection<Category> SubCategories { get; set; } = new List<Category>();
    public ICollection<Material> Materials { get; set; } = new List<Material>();
    public ICollection<LaborCategory> LaborCategories { get; set; } = new List<LaborCategory>();
}

public enum CategoryType
{
    Material = 1,
    Labor = 2
}