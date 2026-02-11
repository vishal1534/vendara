using System.ComponentModel.DataAnnotations;

namespace VendorService.Models.Requests;

/// <summary>
/// Request to add inventory item
/// </summary>
public class CreateInventoryItemRequest
{
    [Required]
    public Guid MaterialId { get; set; }
    
    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal UnitPrice { get; set; }
    
    public decimal? MinimumOrderQuantity { get; set; }
    public decimal? MaximumOrderQuantity { get; set; }
    
    [Range(0, 100)]
    public decimal? DiscountPercentage { get; set; }
    
    public decimal? BulkDiscountQuantity { get; set; }
    
    [Range(0, 100)]
    public decimal? BulkDiscountPercentage { get; set; }
    
    public bool IsInStock { get; set; } = true;
    public decimal? StockQuantity { get; set; }
    public bool TrackInventory { get; set; }
    
    [Range(0, 365)]
    public int? LeadTimeDays { get; set; }
    
    [StringLength(500)]
    public string? Notes { get; set; }
    
    [StringLength(100)]
    public string? BrandName { get; set; }
    
    [StringLength(50)]
    public string? QualityGrade { get; set; }
}
