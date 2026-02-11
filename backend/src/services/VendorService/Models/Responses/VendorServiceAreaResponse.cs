namespace VendorService.Models.Responses;

/// <summary>
/// Vendor service area response DTO
/// </summary>
public class VendorServiceAreaResponse
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
    
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
