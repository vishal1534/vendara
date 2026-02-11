using VendorService.Models.Enums;

namespace VendorService.Models.Responses;

/// <summary>
/// Vendor profile response DTO
/// </summary>
public class VendorResponse
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    
    // Business Information
    public string BusinessName { get; set; } = string.Empty;
    public string? BusinessRegistrationNumber { get; set; }
    public string? GstNumber { get; set; }
    public string? PanNumber { get; set; }
    
    // Contact Information
    public string ContactPersonName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? AlternatePhoneNumber { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? WhatsAppNumber { get; set; }
    
    // Address
    public string AddressLine1 { get; set; } = string.Empty;
    public string? AddressLine2 { get; set; }
    public string? Landmark { get; set; }
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    
    // Business Details
    public string? Description { get; set; }
    public int YearsInBusiness { get; set; }
    public string? BusinessType { get; set; }
    public string? SpecializationAreas { get; set; }
    
    // Status
    public VendorStatus Status { get; set; }
    public bool IsVerified { get; set; }
    public DateTime? VerifiedAt { get; set; }
    
    // Performance
    public decimal AverageRating { get; set; }
    public int TotalRatings { get; set; }
    public int TotalOrders { get; set; }
    public int CompletedOrders { get; set; }
    public decimal? FulfillmentRate { get; set; }
    
    // Settings
    public bool IsActive { get; set; }
    public bool AcceptingOrders { get; set; }
    public decimal? MinimumOrderValue { get; set; }
    public bool AcceptsCredit { get; set; }
    public int? CreditDays { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? LastActiveAt { get; set; }
}
