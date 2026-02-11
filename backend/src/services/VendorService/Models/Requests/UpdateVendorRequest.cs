using System.ComponentModel.DataAnnotations;

namespace VendorService.Models.Requests;

/// <summary>
/// Request to update vendor profile
/// </summary>
public class UpdateVendorRequest
{
    [StringLength(200)]
    public string? BusinessName { get; set; }
    
    [StringLength(100)]
    public string? ContactPersonName { get; set; }
    
    [Phone]
    [StringLength(15)]
    public string? AlternatePhoneNumber { get; set; }
    
    [Phone]
    [StringLength(15)]
    public string? WhatsAppNumber { get; set; }
    
    [StringLength(200)]
    public string? AddressLine1 { get; set; }
    
    [StringLength(200)]
    public string? AddressLine2 { get; set; }
    
    [StringLength(100)]
    public string? Landmark { get; set; }
    
    [StringLength(100)]
    public string? City { get; set; }
    
    [StringLength(100)]
    public string? State { get; set; }
    
    [StringLength(10)]
    public string? PostalCode { get; set; }
    
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    
    [StringLength(1000)]
    public string? Description { get; set; }
    
    [Range(0, 100)]
    public int? YearsInBusiness { get; set; }
    
    [StringLength(50)]
    public string? BusinessType { get; set; }
    
    [StringLength(500)]
    public string? SpecializationAreas { get; set; }
    
    public decimal? MinimumOrderValue { get; set; }
    public bool? AcceptsCredit { get; set; }
    
    [Range(0, 365)]
    public int? CreditDays { get; set; }
    
    public bool? AcceptingOrders { get; set; }
}
