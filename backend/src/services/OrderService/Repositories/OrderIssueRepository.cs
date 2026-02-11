using Microsoft.EntityFrameworkCore;
using OrderService.Data;
using OrderService.Models.Entities;

namespace OrderService.Repositories;

/// <summary>
/// Repository for OrderIssue operations
/// </summary>
public class OrderIssueRepository : IOrderIssueRepository
{
    private readonly OrderServiceDbContext _context;

    public OrderIssueRepository(OrderServiceDbContext context)
    {
        _context = context;
    }

    public async Task<OrderIssue?> GetByIdAsync(Guid id)
    {
        return await _context.OrderIssues
            .Include(i => i.Order)
            .FirstOrDefaultAsync(i => i.Id == id);
    }

    public async Task<List<OrderIssue>> GetByOrderIdAsync(Guid orderId)
    {
        return await _context.OrderIssues
            .Include(i => i.Order)
            .Where(i => i.OrderId == orderId)
            .OrderByDescending(i => i.ReportedAt)
            .ToListAsync();
    }

    public async Task<List<OrderIssue>> GetAllAsync(
        string? status = null,
        Guid? reportedBy = null,
        DateTime? fromDate = null,
        DateTime? toDate = null,
        int skip = 0,
        int take = 50)
    {
        var query = _context.OrderIssues
            .Include(i => i.Order)
            .AsQueryable();

        if (!string.IsNullOrEmpty(status))
            query = query.Where(i => i.Status == status);

        if (reportedBy.HasValue)
            query = query.Where(i => i.ReportedBy == reportedBy.Value);

        if (fromDate.HasValue)
            query = query.Where(i => i.ReportedAt >= fromDate.Value);

        if (toDate.HasValue)
            query = query.Where(i => i.ReportedAt <= toDate.Value);

        return await query
            .OrderByDescending(i => i.ReportedAt)
            .Skip(skip)
            .Take(take)
            .ToListAsync();
    }

    public async Task<List<OrderIssue>> GetByReporterAsync(Guid userId)
    {
        return await _context.OrderIssues
            .Include(i => i.Order)
            .Where(i => i.ReportedBy == userId)
            .OrderByDescending(i => i.ReportedAt)
            .ToListAsync();
    }

    public async Task<List<OrderIssue>> GetOpenIssuesAsync()
    {
        return await _context.OrderIssues
            .Include(i => i.Order)
            .Where(i => i.Status == "open" || i.Status == "in_progress")
            .OrderByDescending(i => i.ReportedAt)
            .ToListAsync();
    }

    public async Task<List<OrderIssue>> GetByIssueTypeAsync(string issueType)
    {
        return await _context.OrderIssues
            .Include(i => i.Order)
            .Where(i => i.IssueType == issueType)
            .OrderByDescending(i => i.ReportedAt)
            .ToListAsync();
    }

    public async Task<OrderIssue> CreateAsync(OrderIssue issue)
    {
        issue.CreatedAt = DateTime.UtcNow;
        issue.UpdatedAt = DateTime.UtcNow;
        issue.ReportedAt = DateTime.UtcNow;
        
        _context.OrderIssues.Add(issue);
        await _context.SaveChangesAsync();
        
        return issue;
    }

    public async Task<OrderIssue> UpdateAsync(OrderIssue issue)
    {
        issue.UpdatedAt = DateTime.UtcNow;
        
        _context.OrderIssues.Update(issue);
        await _context.SaveChangesAsync();
        
        return issue;
    }

    public async Task<IssueStatistics> GetStatisticsAsync(DateTime? fromDate = null, DateTime? toDate = null)
    {
        var query = _context.OrderIssues.AsQueryable();

        if (fromDate.HasValue)
            query = query.Where(i => i.ReportedAt >= fromDate.Value);

        if (toDate.HasValue)
            query = query.Where(i => i.ReportedAt <= toDate.Value);

        var issues = await query.ToListAsync();

        var stats = new IssueStatistics
        {
            TotalIssues = issues.Count,
            OpenIssues = issues.Count(i => i.Status == "open"),
            InProgressIssues = issues.Count(i => i.Status == "in_progress"),
            ResolvedIssues = issues.Count(i => i.Status == "resolved"),
            EscalatedIssues = issues.Count(i => i.EscalatedToDispute),
            IssuesByType = issues.GroupBy(i => i.IssueType)
                .ToDictionary(g => g.Key, g => g.Count()),
            IssuesByReporterRole = issues.GroupBy(i => i.ReportedByRole)
                .ToDictionary(g => g.Key, g => g.Count())
        };

        // Calculate average resolution time
        var resolvedIssues = issues
            .Where(i => i.ResolvedAt.HasValue)
            .ToList();

        if (resolvedIssues.Any())
        {
            var totalHours = resolvedIssues
                .Sum(i => (i.ResolvedAt!.Value - i.ReportedAt).TotalHours);
            stats.AverageResolutionTimeHours = totalHours / resolvedIssues.Count;
        }

        return stats;
    }

    public async Task<bool> HasOpenIssuesAsync(Guid orderId)
    {
        return await _context.OrderIssues
            .AnyAsync(i => i.OrderId == orderId && 
                          (i.Status == "open" || i.Status == "in_progress"));
    }

    public async Task<int> GetCountAsync(string? status = null)
    {
        var query = _context.OrderIssues.AsQueryable();

        if (!string.IsNullOrEmpty(status))
            query = query.Where(i => i.Status == status);

        return await query.CountAsync();
    }
}
