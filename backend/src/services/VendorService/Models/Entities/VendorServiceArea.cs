namespace VendorService.Models.Entities;

/// <summary>
/// Geographic areas where vendor provides services
/// </summary>
public class VendorServiceArea
{
    public Guid Id { get; set; }
    public Guid VendorId { get; set; }
    
    public string AreaName { get; set; } = string.Empty;
    public string? Pincode { get; set; }
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    
    public decimal? DeliveryCharge { get; set; }
    public int? DeliveryTimeDays { get; set; }
    public decimal? MinimumOrderValue { get; set; }
    
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation
    public Vendor Vendor { get; set; } = null!;
}
