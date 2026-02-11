using System.ComponentModel.DataAnnotations;

namespace VendorService.Models.Requests;

/// <summary>
/// Request to create a new vendor
/// </summary>
public class CreateVendorRequest
{
    [Required]
    [StringLength(200)]
    public string BusinessName { get; set; } = string.Empty;
    
    [StringLength(50)]
    public string? BusinessRegistrationNumber { get; set; }
    
    [StringLength(15)]
    public string? GstNumber { get; set; }
    
    [StringLength(10)]
    public string? PanNumber { get; set; }
    
    [Required]
    [StringLength(100)]
    public string ContactPersonName { get; set; } = string.Empty;
    
    [Required]
    [Phone]
    [StringLength(15)]
    public string PhoneNumber { get; set; } = string.Empty;
    
    [Phone]
    [StringLength(15)]
    public string? AlternatePhoneNumber { get; set; }
    
    [Required]
    [EmailAddress]
    [StringLength(100)]
    public string Email { get; set; } = string.Empty;
    
    [Phone]
    [StringLength(15)]
    public string? WhatsAppNumber { get; set; }
    
    [Required]
    [StringLength(200)]
    public string AddressLine1 { get; set; } = string.Empty;
    
    [StringLength(200)]
    public string? AddressLine2 { get; set; }
    
    [StringLength(100)]
    public string? Landmark { get; set; }
    
    [Required]
    [StringLength(100)]
    public string City { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string State { get; set; } = string.Empty;
    
    [Required]
    [StringLength(10)]
    public string PostalCode { get; set; } = string.Empty;
    
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    
    [StringLength(1000)]
    public string? Description { get; set; }
    
    [Range(0, 100)]
    public int YearsInBusiness { get; set; }
    
    [StringLength(50)]
    public string? BusinessType { get; set; }
    
    [StringLength(500)]
    public string? SpecializationAreas { get; set; }
    
    public decimal? MinimumOrderValue { get; set; }
    public bool AcceptsCredit { get; set; }
    
    [Range(0, 365)]
    public int? CreditDays { get; set; }
}
