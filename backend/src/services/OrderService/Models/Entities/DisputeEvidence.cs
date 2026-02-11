namespace OrderService.Models.Entities;

/// <summary>
/// Evidence attachments for disputes (images, documents, videos)
/// </summary>
public class DisputeEvidence
{
    /// <summary>
    /// Unique evidence identifier
    /// </summary>
    public Guid Id { get; set; }
    
    /// <summary>
    /// Dispute ID this evidence belongs to
    /// </summary>
    public Guid DisputeId { get; set; }
    
    /// <summary>
    /// Dispute reference
    /// </summary>
    public Dispute Dispute { get; set; } = null!;
    
    /// <summary>
    /// Type of evidence (image, document, video)
    /// </summary>
    public string Type { get; set; } = string.Empty;
    
    /// <summary>
    /// URL/path to the evidence file
    /// </summary>
    public string Url { get; set; } = string.Empty;
    
    /// <summary>
    /// User ID who uploaded this evidence
    /// </summary>
    public Guid UploadedBy { get; set; }
    
    /// <summary>
    /// Role of uploader (buyer, vendor, admin)
    /// </summary>
    public string UploadedByRole { get; set; } = string.Empty;
    
    /// <summary>
    /// Optional description of the evidence
    /// </summary>
    public string? Description { get; set; }
    
    /// <summary>
    /// When evidence was uploaded
    /// </summary>
    public DateTime UploadedAt { get; set; }
}
