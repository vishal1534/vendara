using VendorService.Models.Enums;

namespace VendorService.Models.Entities;

/// <summary>
/// Vendor entity representing a supplier/service provider
/// </summary>
public class Vendor
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; } // Links to Identity Service user
    
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
    public string? BusinessType { get; set; } // Retail, Wholesale, Manufacturer, Labor Contractor
    public string? SpecializationAreas { get; set; } // Comma-separated
    
    // Status and Verification
    public VendorStatus Status { get; set; } = VendorStatus.PendingVerification;
    public bool IsVerified { get; set; }
    public DateTime? VerifiedAt { get; set; }
    public Guid? VerifiedBy { get; set; }
    public string? RejectionReason { get; set; }
    
    // Ratings and Performance
    public decimal AverageRating { get; set; }
    public int TotalRatings { get; set; }
    public int TotalOrders { get; set; }
    public int CompletedOrders { get; set; }
    public int CancelledOrders { get; set; }
    public decimal? FulfillmentRate { get; set; } // Percentage
    public decimal? ResponseTime { get; set; } // Average in minutes
    
    // Financial
    public decimal? MinimumOrderValue { get; set; }
    public bool AcceptsCredit { get; set; }
    public int? CreditDays { get; set; }
    
    // Settings
    public bool IsActive { get; set; } = true;
    public bool AcceptingOrders { get; set; } = true;
    public string? NotificationPreferences { get; set; } // JSON
    
    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastActiveAt { get; set; }
    
    // Navigation Properties
    public ICollection<VendorDocument> Documents { get; set; } = new List<VendorDocument>();
    public ICollection<VendorInventoryItem> InventoryItems { get; set; } = new List<VendorInventoryItem>();
    public ICollection<VendorLaborAvailability> LaborAvailability { get; set; } = new List<VendorLaborAvailability>();
    public ICollection<VendorServiceArea> ServiceAreas { get; set; } = new List<VendorServiceArea>();
    public ICollection<VendorBusinessHour> BusinessHours { get; set; } = new List<VendorBusinessHour>();
    public ICollection<VendorBankAccount> BankAccounts { get; set; } = new List<VendorBankAccount>();
    public ICollection<VendorRating> Ratings { get; set; } = new List<VendorRating>();
}
