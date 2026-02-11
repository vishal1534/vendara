using System.ComponentModel.DataAnnotations;

namespace VendorService.Models.Requests;

/// <summary>
/// Request to update inventory item
/// </summary>
public class UpdateInventoryItemRequest
{
    [Range(0.01, double.MaxValue)]
    public decimal? UnitPrice { get; set; }
    
    public decimal? MinimumOrderQuantity { get; set; }
    public decimal? MaximumOrderQuantity { get; set; }
    
    [Range(0, 100)]
    public decimal? DiscountPercentage { get; set; }
    
    public decimal? BulkDiscountQuantity { get; set; }
    
    [Range(0, 100)]
    public decimal? BulkDiscountPercentage { get; set; }
    
    public bool? IsInStock { get; set; }
    public decimal? StockQuantity { get; set; }
    public bool? TrackInventory { get; set; }
    
    [Range(0, 365)]
    public int? LeadTimeDays { get; set; }
    
    public bool? IsAvailable { get; set; }
    
    [StringLength(500)]
    public string? Notes { get; set; }
    
    [StringLength(100)]
    public string? BrandName { get; set; }
    
    [StringLength(50)]
    public string? QualityGrade { get; set; }
}
