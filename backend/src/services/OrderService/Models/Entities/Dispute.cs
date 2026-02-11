using OrderService.Models.Enums;

namespace OrderService.Models.Entities;

/// <summary>
/// Dispute entity for tracking order disputes raised by buyers or vendors
/// </summary>
public class Dispute
{
    /// <summary>
    /// Unique dispute identifier
    /// </summary>
    public Guid Id { get; set; }
    
    /// <summary>
    /// Order ID that is being disputed
    /// </summary>
    public Guid OrderId { get; set; }
    
    /// <summary>
    /// Order reference
    /// </summary>
    public Order Order { get; set; } = null!;
    
    /// <summary>
    /// Reason for dispute
    /// </summary>
    public DisputeReason Reason { get; set; }
    
    /// <summary>
    /// Detailed description of the dispute
    /// </summary>
    public string Description { get; set; } = string.Empty;
    
    /// <summary>
    /// Current dispute status
    /// </summary>
    public DisputeStatus Status { get; set; }
    
    /// <summary>
    /// Priority level
    /// </summary>
    public DisputePriority Priority { get; set; }
    
    /// <summary>
    /// Amount being disputed
    /// </summary>
    public decimal DisputedAmount { get; set; }
    
    /// <summary>
    /// Refund amount (if applicable)
    /// </summary>
    public decimal? RefundAmount { get; set; }
    
    /// <summary>
    /// User ID who raised the dispute (buyer or vendor)
    /// </summary>
    public Guid RaisedBy { get; set; }
    
    /// <summary>
    /// Role of the person who raised dispute (buyer/vendor)
    /// </summary>
    public string RaisedByRole { get; set; } = string.Empty;
    
    /// <summary>
    /// Admin user ID assigned to handle this dispute
    /// </summary>
    public Guid? AssignedTo { get; set; }
    
    /// <summary>
    /// When the dispute was assigned
    /// </summary>
    public DateTime? AssignedAt { get; set; }
    
    /// <summary>
    /// Resolution notes from admin
    /// </summary>
    public string? ResolutionNote { get; set; }
    
    /// <summary>
    /// Admin user ID who resolved the dispute
    /// </summary>
    public Guid? ResolvedBy { get; set; }
    
    /// <summary>
    /// When the dispute was resolved
    /// </summary>
    public DateTime? ResolvedAt { get; set; }
    
    /// <summary>
    /// When the dispute was escalated
    /// </summary>
    public DateTime? EscalatedAt { get; set; }
    
    /// <summary>
    /// Reason for escalation
    /// </summary>
    public string? EscalationReason { get; set; }
    
    /// <summary>
    /// Evidence attachments
    /// </summary>
    public ICollection<DisputeEvidence> Evidence { get; set; } = new List<DisputeEvidence>();
    
    /// <summary>
    /// Timeline of dispute actions
    /// </summary>
    public ICollection<DisputeTimeline> Timeline { get; set; } = new List<DisputeTimeline>();
    
    /// <summary>
    /// Dispute created timestamp
    /// </summary>
    public DateTime CreatedAt { get; set; }
    
    /// <summary>
    /// Dispute last updated timestamp
    /// </summary>
    public DateTime UpdatedAt { get; set; }
}
