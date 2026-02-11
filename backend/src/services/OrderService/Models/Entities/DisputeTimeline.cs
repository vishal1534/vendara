namespace OrderService.Models.Entities;

/// <summary>
/// Timeline entry for dispute activities
/// </summary>
public class DisputeTimeline
{
    /// <summary>
    /// Unique timeline entry identifier
    /// </summary>
    public Guid Id { get; set; }
    
    /// <summary>
    /// Dispute ID this timeline belongs to
    /// </summary>
    public Guid DisputeId { get; set; }
    
    /// <summary>
    /// Dispute reference
    /// </summary>
    public Dispute Dispute { get; set; } = null!;
    
    /// <summary>
    /// Actor name (user who performed the action)
    /// </summary>
    public string Actor { get; set; } = string.Empty;
    
    /// <summary>
    /// Actor user ID
    /// </summary>
    public Guid ActorId { get; set; }
    
    /// <summary>
    /// Role of the actor (buyer, vendor, admin)
    /// </summary>
    public string ActorRole { get; set; } = string.Empty;
    
    /// <summary>
    /// Action performed (e.g., "Dispute Created", "Evidence Uploaded", "Status Changed")
    /// </summary>
    public string Action { get; set; } = string.Empty;
    
    /// <summary>
    /// Detailed description of the action
    /// </summary>
    public string Description { get; set; } = string.Empty;
    
    /// <summary>
    /// Additional metadata as JSON
    /// </summary>
    public string? Metadata { get; set; }
    
    /// <summary>
    /// When this action occurred
    /// </summary>
    public DateTime Timestamp { get; set; }
}
