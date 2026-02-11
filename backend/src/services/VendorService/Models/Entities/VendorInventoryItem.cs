namespace VendorService.Models.Entities;

/// <summary>
/// Materials/products that a vendor sells
/// Links to Catalog Service materials
/// </summary>
public class VendorInventoryItem
{
    public Guid Id { get; set; }
    public Guid VendorId { get; set; }
    public Guid MaterialId { get; set; } // Links to Catalog Service
    
    // Pricing
    public decimal UnitPrice { get; set; }
    public decimal? MinimumOrderQuantity { get; set; }
    public decimal? MaximumOrderQuantity { get; set; }
    public decimal? DiscountPercentage { get; set; }
    public decimal? BulkDiscountQuantity { get; set; }
    public decimal? BulkDiscountPercentage { get; set; }
    
    // Stock Management
    public bool IsInStock { get; set; } = true;
    public decimal? StockQuantity { get; set; }
    public bool TrackInventory { get; set; } = false;
    public decimal? ReorderLevel { get; set; }
    public int? LeadTimeDays { get; set; }
    
    // Availability
    public bool IsAvailable { get; set; } = true;
    public DateTime? AvailableFrom { get; set; }
    public DateTime? AvailableUntil { get; set; }
    
    // Additional Info
    public string? Notes { get; set; }
    public string? BrandName { get; set; }
    public string? QualityGrade { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation
    public Vendor Vendor { get; set; } = null!;
}
