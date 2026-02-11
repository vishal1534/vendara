using RealServ.Shared.Domain.Entities;

namespace CatalogService.Models.Entities;

/// <summary>
/// Construction material (cement, bricks, steel, sand, etc.)
/// </summary>
public class Material : BaseEntity
{
    /// <summary>
    /// Category this material belongs to
    /// </summary>
    public Guid CategoryId { get; set; }

    /// <summary>
    /// Material name (e.g., "OPC 53 Grade Cement", "Red Clay Bricks")
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Detailed description
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// SKU or product code
    /// </summary>
    public string? Sku { get; set; }

    /// <summary>
    /// Base price per unit (platform-wide reference price)
    /// </summary>
    public decimal BasePrice { get; set; }

    /// <summary>
    /// Unit of measurement (kg, ton, bag, piece, cft, sqft, etc.)
    /// </summary>
    public string Unit { get; set; } = string.Empty;

    /// <summary>
    /// Minimum order quantity
    /// </summary>
    public decimal MinOrderQuantity { get; set; } = 1;

    /// <summary>
    /// Maximum order quantity (optional limit)
    /// </summary>
    public decimal? MaxOrderQuantity { get; set; }

    /// <summary>
    /// Product image URL
    /// </summary>
    public string? ImageUrl { get; set; }

    /// <summary>
    /// Brand name (if applicable)
    /// </summary>
    public string? Brand { get; set; }

    /// <summary>
    /// Specifications (e.g., "53 Grade, 50kg bag")
    /// </summary>
    public string? Specifications { get; set; }

    /// <summary>
    /// HSN code for GST
    /// </summary>
    public string? HsnCode { get; set; }

    /// <summary>
    /// GST percentage
    /// </summary>
    public decimal GstPercentage { get; set; } = 18;

    /// <summary>
    /// Is this material currently available on the platform?
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Display order for UI
    /// </summary>
    public int DisplayOrder { get; set; }

    /// <summary>
    /// Is this a popular/featured material?
    /// </summary>
    public bool IsPopular { get; set; } = false;

    /// <summary>
    /// Tags for search and filtering (JSON array stored as string)
    /// </summary>
    public string? Tags { get; set; }

    // Navigation properties
    public Category Category { get; set; } = null!;
    public ICollection<VendorInventory> VendorInventories { get; set; } = new List<VendorInventory>();
}