namespace VendorService.Models.Responses;

/// <summary>
/// Vendor rating response DTO
/// </summary>
public class VendorRatingResponse
{
    public Guid Id { get; set; }
    public Guid VendorId { get; set; }
    public Guid OrderId { get; set; }
    public Guid CustomerId { get; set; }
    
    public int Rating { get; set; }
    public string? Review { get; set; }
    
    public int? QualityRating { get; set; }
    public int? TimelinessRating { get; set; }
    public int? CommunicationRating { get; set; }
    public int? ProfessionalismRating { get; set; }
    
    public bool IsVerifiedPurchase { get; set; }
    public bool IsPublic { get; set; }
    
    public string? VendorResponse { get; set; }
    public DateTime? RespondedAt { get; set; }
    
    public DateTime CreatedAt { get; set; }
}
