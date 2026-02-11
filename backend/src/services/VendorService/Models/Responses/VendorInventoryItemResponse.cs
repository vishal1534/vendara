namespace VendorService.Models.Responses;

/// <summary>
/// Vendor inventory item response DTO
/// </summary>
public class VendorInventoryItemResponse
{
    public Guid Id { get; set; }
    public Guid VendorId { get; set; }
    public Guid MaterialId { get; set; }
    
    public decimal UnitPrice { get; set; }
    public decimal? MinimumOrderQuantity { get; set; }
    public decimal? MaximumOrderQuantity { get; set; }
    public decimal? DiscountPercentage { get; set; }
    public decimal? BulkDiscountQuantity { get; set; }
    public decimal? BulkDiscountPercentage { get; set; }
    
    public bool IsInStock { get; set; }
    public decimal? StockQuantity { get; set; }
    public bool TrackInventory { get; set; }
    public int? LeadTimeDays { get; set; }
    
    public bool IsAvailable { get; set; }
    public string? Notes { get; set; }
    public string? BrandName { get; set; }
    public string? QualityGrade { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
