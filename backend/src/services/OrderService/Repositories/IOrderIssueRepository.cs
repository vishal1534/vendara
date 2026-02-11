using OrderService.Models.Entities;

namespace OrderService.Repositories;

/// <summary>
/// Repository interface for OrderIssue operations
/// </summary>
public interface IOrderIssueRepository
{
    /// <summary>
    /// Get issue by ID
    /// </summary>
    Task<OrderIssue?> GetByIdAsync(Guid id);
    
    /// <summary>
    /// Get all issues for an order
    /// </summary>
    Task<List<OrderIssue>> GetByOrderIdAsync(Guid orderId);
    
    /// <summary>
    /// Get all issues with optional filtering
    /// </summary>
    Task<List<OrderIssue>> GetAllAsync(
        string? status = null,
        Guid? reportedBy = null,
        DateTime? fromDate = null,
        DateTime? toDate = null,
        int skip = 0,
        int take = 50);
    
    /// <summary>
    /// Get issues reported by specific user
    /// </summary>
    Task<List<OrderIssue>> GetByReporterAsync(Guid userId);
    
    /// <summary>
    /// Get open/unresolved issues
    /// </summary>
    Task<List<OrderIssue>> GetOpenIssuesAsync();
    
    /// <summary>
    /// Get issues by type
    /// </summary>
    Task<List<OrderIssue>> GetByIssueTypeAsync(string issueType);
    
    /// <summary>
    /// Create new issue
    /// </summary>
    Task<OrderIssue> CreateAsync(OrderIssue issue);
    
    /// <summary>
    /// Update issue
    /// </summary>
    Task<OrderIssue> UpdateAsync(OrderIssue issue);
    
    /// <summary>
    /// Get issue statistics
    /// </summary>
    Task<IssueStatistics> GetStatisticsAsync(DateTime? fromDate = null, DateTime? toDate = null);
    
    /// <summary>
    /// Check if order has open issues
    /// </summary>
    Task<bool> HasOpenIssuesAsync(Guid orderId);
    
    /// <summary>
    /// Get total count
    /// </summary>
    Task<int> GetCountAsync(string? status = null);
}

/// <summary>
/// Issue statistics
/// </summary>
public class IssueStatistics
{
    public int TotalIssues { get; set; }
    public int OpenIssues { get; set; }
    public int InProgressIssues { get; set; }
    public int ResolvedIssues { get; set; }
    public int EscalatedIssues { get; set; }
    public double AverageResolutionTimeHours { get; set; }
    public Dictionary<string, int> IssuesByType { get; set; } = new();
    public Dictionary<string, int> IssuesByReporterRole { get; set; } = new();
}
