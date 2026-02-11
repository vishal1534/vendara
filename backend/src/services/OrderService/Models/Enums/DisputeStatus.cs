namespace OrderService.Models.Enums;

/// <summary>
/// Status of a dispute
/// </summary>
public enum DisputeStatus
{
    /// <summary>
    /// Dispute newly opened
    /// </summary>
    Open = 1,
    
    /// <summary>
    /// Dispute under review by admin
    /// </summary>
    UnderReview = 2,
    
    /// <summary>
    /// Resolved with full refund
    /// </summary>
    ResolvedRefund = 3,
    
    /// <summary>
    /// Resolved with replacement
    /// </summary>
    ResolvedReplacement = 4,
    
    /// <summary>
    /// Resolved with partial refund
    /// </summary>
    ResolvedPartialRefund = 5,
    
    /// <summary>
    /// Dispute rejected (no action taken)
    /// </summary>
    Rejected = 6,
    
    /// <summary>
    /// Escalated to higher authority
    /// </summary>
    Escalated = 7
}
