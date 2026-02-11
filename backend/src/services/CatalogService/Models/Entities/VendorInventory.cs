using RealServ.Shared.Domain.Entities;

namespace CatalogService.Models.Entities;

/// <summary>
/// Vendor's material inventory and pricing
/// </summary>
public class VendorInventory : BaseEntity
{
    /// <summary>
    /// Vendor ID (from Identity Service)
    /// </summary>
    public Guid VendorId { get; set; }

    /// <summary>
    /// Material ID
    /// </summary>
    public Guid MaterialId { get; set; }

    /// <summary>
    /// Is this material available from this vendor?
    /// </summary>
    public bool IsAvailable { get; set; } = true;

    /// <summary>
    /// Vendor's price per unit (can differ from base price)
    /// </summary>
    public decimal VendorPrice { get; set; }

    /// <summary>
    /// Current stock quantity (optional, -1 means unlimited)
    /// </summary>
    public decimal StockQuantity { get; set; } = -1;

    /// <summary>
    /// Minimum order quantity for this vendor
    /// </summary>
    public decimal MinOrderQuantity { get; set; } = 1;

    /// <summary>
    /// Maximum order quantity for this vendor (optional)
    /// </summary>
    public decimal? MaxOrderQuantity { get; set; }

    /// <summary>
    /// Stock alert threshold - triggers notification when stock falls below this level
    /// </summary>
    public decimal? StockAlertThreshold { get; set; }

    /// <summary>
    /// Is stock currently below alert threshold?
    /// </summary>
    public bool IsLowStock => StockAlertThreshold.HasValue && 
                               StockQuantity >= 0 && 
                               StockQuantity <= StockAlertThreshold.Value;

    /// <summary>
    /// Lead time in days for delivery
    /// </summary>
    public int LeadTimeDays { get; set; } = 1;

    /// <summary>
    /// Last restocked timestamp
    /// </summary>
    public DateTime? LastRestockedAt { get; set; }

    /// <summary>
    /// Last updated timestamp
    /// </summary>
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Material Material { get; set; } = null!;
}