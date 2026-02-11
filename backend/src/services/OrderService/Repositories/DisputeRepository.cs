using Microsoft.EntityFrameworkCore;
using OrderService.Data;
using OrderService.Models.Entities;
using OrderService.Models.Enums;

namespace OrderService.Repositories;

/// <summary>
/// Repository for Dispute operations
/// </summary>
public class DisputeRepository : IDisputeRepository
{
    private readonly OrderServiceDbContext _context;

    public DisputeRepository(OrderServiceDbContext context)
    {
        _context = context;
    }

    public async Task<Dispute?> GetByIdAsync(Guid id)
    {
        return await _context.Disputes
            .Include(d => d.Order)
            .Include(d => d.Evidence)
            .Include(d => d.Timeline.OrderBy(t => t.Timestamp))
            .FirstOrDefaultAsync(d => d.Id == id);
    }

    public async Task<Dispute?> GetByOrderIdAsync(Guid orderId)
    {
        return await _context.Disputes
            .Include(d => d.Order)
            .Include(d => d.Evidence)
            .Include(d => d.Timeline.OrderBy(t => t.Timestamp))
            .FirstOrDefaultAsync(d => d.OrderId == orderId);
    }

    public async Task<List<Dispute>> GetAllAsync(
        DisputeStatus? status = null,
        DisputePriority? priority = null,
        Guid? assignedTo = null,
        DateTime? fromDate = null,
        DateTime? toDate = null,
        int skip = 0,
        int take = 50)
    {
        var query = _context.Disputes
            .Include(d => d.Order)
            .Include(d => d.Evidence)
            .AsQueryable();

        if (status.HasValue)
            query = query.Where(d => d.Status == status.Value);

        if (priority.HasValue)
            query = query.Where(d => d.Priority == priority.Value);

        if (assignedTo.HasValue)
            query = query.Where(d => d.AssignedTo == assignedTo.Value);

        if (fromDate.HasValue)
            query = query.Where(d => d.CreatedAt >= fromDate.Value);

        if (toDate.HasValue)
            query = query.Where(d => d.CreatedAt <= toDate.Value);

        return await query
            .OrderByDescending(d => d.CreatedAt)
            .Skip(skip)
            .Take(take)
            .ToListAsync();
    }

    public async Task<List<Dispute>> GetByAssignedToAsync(Guid adminId)
    {
        return await _context.Disputes
            .Include(d => d.Order)
            .Include(d => d.Evidence)
            .Where(d => d.AssignedTo == adminId)
            .OrderByDescending(d => d.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Dispute>> GetByRaisedByAsync(Guid userId)
    {
        return await _context.Disputes
            .Include(d => d.Order)
            .Include(d => d.Evidence)
            .Where(d => d.RaisedBy == userId)
            .OrderByDescending(d => d.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Dispute>> GetOpenDisputesAsync()
    {
        return await _context.Disputes
            .Include(d => d.Order)
            .Include(d => d.Evidence)
            .Where(d => d.Status == DisputeStatus.Open || d.Status == DisputeStatus.UnderReview)
            .OrderByDescending(d => d.Priority)
            .ThenByDescending(d => d.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Dispute>> GetEscalatedDisputesAsync()
    {
        return await _context.Disputes
            .Include(d => d.Order)
            .Include(d => d.Evidence)
            .Where(d => d.Status == DisputeStatus.Escalated)
            .OrderByDescending(d => d.EscalatedAt)
            .ToListAsync();
    }

    public async Task<Dispute> CreateAsync(Dispute dispute)
    {
        dispute.CreatedAt = DateTime.UtcNow;
        dispute.UpdatedAt = DateTime.UtcNow;
        
        _context.Disputes.Add(dispute);
        await _context.SaveChangesAsync();
        
        return dispute;
    }

    public async Task<Dispute> UpdateAsync(Dispute dispute)
    {
        dispute.UpdatedAt = DateTime.UtcNow;
        
        _context.Disputes.Update(dispute);
        await _context.SaveChangesAsync();
        
        return dispute;
    }

    public async Task<DisputeEvidence> AddEvidenceAsync(DisputeEvidence evidence)
    {
        evidence.UploadedAt = DateTime.UtcNow;
        
        _context.DisputeEvidences.Add(evidence);
        await _context.SaveChangesAsync();
        
        return evidence;
    }

    public async Task<DisputeTimeline> AddTimelineEntryAsync(DisputeTimeline timeline)
    {
        timeline.Timestamp = DateTime.UtcNow;
        
        _context.DisputeTimelines.Add(timeline);
        await _context.SaveChangesAsync();
        
        return timeline;
    }

    public async Task<DisputeStatistics> GetStatisticsAsync(DateTime? fromDate = null, DateTime? toDate = null)
    {
        var query = _context.Disputes.AsQueryable();

        if (fromDate.HasValue)
            query = query.Where(d => d.CreatedAt >= fromDate.Value);

        if (toDate.HasValue)
            query = query.Where(d => d.CreatedAt <= toDate.Value);

        var disputes = await query.ToListAsync();

        var stats = new DisputeStatistics
        {
            TotalDisputes = disputes.Count,
            OpenDisputes = disputes.Count(d => d.Status == DisputeStatus.Open),
            UnderReviewDisputes = disputes.Count(d => d.Status == DisputeStatus.UnderReview),
            ResolvedDisputes = disputes.Count(d => 
                d.Status == DisputeStatus.ResolvedRefund || 
                d.Status == DisputeStatus.ResolvedReplacement || 
                d.Status == DisputeStatus.ResolvedPartialRefund),
            EscalatedDisputes = disputes.Count(d => d.Status == DisputeStatus.Escalated),
            TotalDisputedAmount = disputes.Sum(d => d.DisputedAmount),
            TotalRefundedAmount = disputes.Where(d => d.RefundAmount.HasValue).Sum(d => d.RefundAmount!.Value),
            DisputesByReason = disputes.GroupBy(d => d.Reason)
                .ToDictionary(g => g.Key, g => g.Count()),
            DisputesByPriority = disputes.GroupBy(d => d.Priority)
                .ToDictionary(g => g.Key, g => g.Count())
        };

        // Calculate average resolution time
        var resolvedDisputes = disputes
            .Where(d => d.ResolvedAt.HasValue)
            .ToList();

        if (resolvedDisputes.Any())
        {
            var totalHours = resolvedDisputes
                .Sum(d => (d.ResolvedAt!.Value - d.CreatedAt).TotalHours);
            stats.AverageResolutionTimeHours = totalHours / resolvedDisputes.Count;
        }

        return stats;
    }

    public async Task<bool> HasActiveDisputeAsync(Guid orderId)
    {
        return await _context.Disputes
            .AnyAsync(d => d.OrderId == orderId && 
                          (d.Status == DisputeStatus.Open || d.Status == DisputeStatus.UnderReview));
    }

    public async Task<int> GetCountAsync(DisputeStatus? status = null)
    {
        var query = _context.Disputes.AsQueryable();

        if (status.HasValue)
            query = query.Where(d => d.Status == status.Value);

        return await query.CountAsync();
    }
}
