using OrderService.Models.Entities;
using OrderService.Models.Enums;

namespace OrderService.Repositories;

/// <summary>
/// Repository interface for Dispute operations
/// </summary>
public interface IDisputeRepository
{
    /// <summary>
    /// Get dispute by ID
    /// </summary>
    Task<Dispute?> GetByIdAsync(Guid id);
    
    /// <summary>
    /// Get dispute by order ID
    /// </summary>
    Task<Dispute?> GetByOrderIdAsync(Guid orderId);
    
    /// <summary>
    /// Get all disputes with optional filtering
    /// </summary>
    Task<List<Dispute>> GetAllAsync(
        DisputeStatus? status = null,
        DisputePriority? priority = null,
        Guid? assignedTo = null,
        DateTime? fromDate = null,
        DateTime? toDate = null,
        int skip = 0,
        int take = 50);
    
    /// <summary>
    /// Get disputes assigned to specific admin
    /// </summary>
    Task<List<Dispute>> GetByAssignedToAsync(Guid adminId);
    
    /// <summary>
    /// Get disputes raised by specific user
    /// </summary>
    Task<List<Dispute>> GetByRaisedByAsync(Guid userId);
    
    /// <summary>
    /// Get open/unresolved disputes
    /// </summary>
    Task<List<Dispute>> GetOpenDisputesAsync();
    
    /// <summary>
    /// Get escalated disputes
    /// </summary>
    Task<List<Dispute>> GetEscalatedDisputesAsync();
    
    /// <summary>
    /// Create new dispute
    /// </summary>
    Task<Dispute> CreateAsync(Dispute dispute);
    
    /// <summary>
    /// Update dispute
    /// </summary>
    Task<Dispute> UpdateAsync(Dispute dispute);
    
    /// <summary>
    /// Add evidence to dispute
    /// </summary>
    Task<DisputeEvidence> AddEvidenceAsync(DisputeEvidence evidence);
    
    /// <summary>
    /// Add timeline entry to dispute
    /// </summary>
    Task<DisputeTimeline> AddTimelineEntryAsync(DisputeTimeline timeline);
    
    /// <summary>
    /// Get dispute statistics
    /// </summary>
    Task<DisputeStatistics> GetStatisticsAsync(DateTime? fromDate = null, DateTime? toDate = null);
    
    /// <summary>
    /// Check if order has active dispute
    /// </summary>
    Task<bool> HasActiveDisputeAsync(Guid orderId);
    
    /// <summary>
    /// Get total count
    /// </summary>
    Task<int> GetCountAsync(DisputeStatus? status = null);
}

/// <summary>
/// Dispute statistics
/// </summary>
public class DisputeStatistics
{
    public int TotalDisputes { get; set; }
    public int OpenDisputes { get; set; }
    public int UnderReviewDisputes { get; set; }
    public int ResolvedDisputes { get; set; }
    public int EscalatedDisputes { get; set; }
    public decimal TotalDisputedAmount { get; set; }
    public decimal TotalRefundedAmount { get; set; }
    public double AverageResolutionTimeHours { get; set; }
    public Dictionary<DisputeReason, int> DisputesByReason { get; set; } = new();
    public Dictionary<DisputePriority, int> DisputesByPriority { get; set; } = new();
}
