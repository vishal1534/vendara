namespace OrderService.Models.Entities;

/// <summary>
/// Order issue entity for tracking problems reported by vendors or buyers during order fulfillment
/// </summary>
public class OrderIssue
{
    /// <summary>
    /// Unique issue identifier
    /// </summary>
    public Guid Id { get; set; }
    
    /// <summary>
    /// Order ID this issue belongs to
    /// </summary>
    public Guid OrderId { get; set; }
    
    /// <summary>
    /// Order reference
    /// </summary>
    public Order Order { get; set; } = null!;
    
    /// <summary>
    /// Issue description
    /// </summary>
    public string Description { get; set; } = string.Empty;
    
    /// <summary>
    /// Issue type/category
    /// </summary>
    public string IssueType { get; set; } = string.Empty;
    
    /// <summary>
    /// Current status (open, in_progress, resolved, escalated)
    /// </summary>
    public string Status { get; set; } = string.Empty;
    
    /// <summary>
    /// User ID who reported the issue
    /// </summary>
    public Guid ReportedBy { get; set; }
    
    /// <summary>
    /// Role of reporter (vendor, buyer)
    /// </summary>
    public string ReportedByRole { get; set; } = string.Empty;
    
    /// <summary>
    /// When the issue was reported
    /// </summary>
    public DateTime ReportedAt { get; set; }
    
    /// <summary>
    /// Resolution description
    /// </summary>
    public string? Resolution { get; set; }
    
    /// <summary>
    /// User ID who resolved the issue
    /// </summary>
    public Guid? ResolvedBy { get; set; }
    
    /// <summary>
    /// When the issue was resolved
    /// </summary>
    public DateTime? ResolvedAt { get; set; }
    
    /// <summary>
    /// Whether this issue was escalated to a dispute
    /// </summary>
    public bool EscalatedToDispute { get; set; }
    
    /// <summary>
    /// Dispute ID if escalated
    /// </summary>
    public Guid? DisputeId { get; set; }
    
    /// <summary>
    /// Additional notes
    /// </summary>
    public string? Notes { get; set; }
    
    /// <summary>
    /// Issue created timestamp
    /// </summary>
    public DateTime CreatedAt { get; set; }
    
    /// <summary>
    /// Issue last updated timestamp
    /// </summary>
    public DateTime UpdatedAt { get; set; }
}
