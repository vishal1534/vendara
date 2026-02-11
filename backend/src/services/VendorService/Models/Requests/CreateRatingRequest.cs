using System.ComponentModel.DataAnnotations;

namespace VendorService.Models.Requests;

/// <summary>
/// Request to create vendor rating
/// </summary>
public class CreateRatingRequest
{
    [Required]
    public Guid OrderId { get; set; }
    
    [Required]
    [Range(1, 5)]
    public int Rating { get; set; }
    
    [StringLength(1000)]
    public string? Review { get; set; }
    
    [Range(1, 5)]
    public int? QualityRating { get; set; }
    
    [Range(1, 5)]
    public int? TimelinessRating { get; set; }
    
    [Range(1, 5)]
    public int? CommunicationRating { get; set; }
    
    [Range(1, 5)]
    public int? ProfessionalismRating { get; set; }
}
