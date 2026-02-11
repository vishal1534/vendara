namespace VendorService.Models.Entities;

/// <summary>
/// Customer ratings and reviews for vendors
/// </summary>
public class VendorRating
{
    public Guid Id { get; set; }
    public Guid VendorId { get; set; }
    public Guid OrderId { get; set; } // Links to Order Service
    public Guid CustomerId { get; set; } // Links to Identity Service
    
    public int Rating { get; set; } // 1-5 stars
    public string? Review { get; set; }
    
    // Detailed Ratings
    public int? QualityRating { get; set; }
    public int? TimelinessRating { get; set; }
    public int? CommunicationRating { get; set; }
    public int? ProfessionalismRating { get; set; }
    
    public bool IsVerifiedPurchase { get; set; }
    public bool IsPublic { get; set; } = true;
    
    // Vendor Response
    public string? VendorResponse { get; set; }
    public DateTime? RespondedAt { get; set; }
    
    // Moderation
    public bool IsFlagged { get; set; }
    public string? FlagReason { get; set; }
    public bool IsApproved { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation
    public Vendor Vendor { get; set; } = null!;
}
