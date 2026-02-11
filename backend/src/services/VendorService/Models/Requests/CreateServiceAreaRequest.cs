using System.ComponentModel.DataAnnotations;

namespace VendorService.Models.Requests;

/// <summary>
/// Request to add service area
/// </summary>
public class CreateServiceAreaRequest
{
    [Required]
    [StringLength(100)]
    public string AreaName { get; set; } = string.Empty;
    
    [StringLength(10)]
    public string? Pincode { get; set; }
    
    [Required]
    [StringLength(100)]
    public string City { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string State { get; set; } = string.Empty;
    
    [Range(0, double.MaxValue)]
    public decimal? DeliveryCharge { get; set; }
    
    [Range(0, 30)]
    public int? DeliveryTimeDays { get; set; }
    
    [Range(0, double.MaxValue)]
    public decimal? MinimumOrderValue { get; set; }
}
