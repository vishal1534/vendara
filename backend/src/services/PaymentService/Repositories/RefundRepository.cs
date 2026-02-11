using Microsoft.EntityFrameworkCore;
using PaymentService.Data;
using PaymentService.Models.Entities;

namespace PaymentService.Repositories;

public class RefundRepository : IRefundRepository
{
    private readonly PaymentDbContext _context;

    public RefundRepository(PaymentDbContext context)
    {
        _context = context;
    }

    public async Task<PaymentRefund?> GetByIdAsync(Guid id)
    {
        return await _context.PaymentRefunds
            .Include(r => r.Payment)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<List<PaymentRefund>> GetByPaymentIdAsync(Guid paymentId)
    {
        return await _context.PaymentRefunds
            .Where(r => r.PaymentId == paymentId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<PaymentRefund>> GetAllAsync(int page, int pageSize, string? status = null)
    {
        var query = _context.PaymentRefunds
            .Include(r => r.Payment)
            .AsQueryable();

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(r => r.RefundStatus == status);
        }

        return await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<PaymentRefund> CreateAsync(PaymentRefund refund)
    {
        _context.PaymentRefunds.Add(refund);
        await _context.SaveChangesAsync();
        return refund;
    }

    public async Task<PaymentRefund> UpdateAsync(PaymentRefund refund)
    {
        refund.UpdatedAt = DateTime.UtcNow;
        _context.PaymentRefunds.Update(refund);
        await _context.SaveChangesAsync();
        return refund;
    }

    public async Task<int> GetTotalCountAsync(string? status = null)
    {
        var query = _context.PaymentRefunds.AsQueryable();

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(r => r.RefundStatus == status);
        }

        return await query.CountAsync();
    }

    public async Task<decimal> GetTotalRefundAmountAsync(DateTime? startDate = null, DateTime? endDate = null)
    {
        var query = _context.PaymentRefunds
            .Where(r => r.RefundStatus == "completed");

        if (startDate.HasValue)
        {
            query = query.Where(r => r.CompletedAt >= startDate);
        }

        if (endDate.HasValue)
        {
            query = query.Where(r => r.CompletedAt <= endDate);
        }

        return await query.SumAsync(r => (decimal?)r.Amount) ?? 0;
    }
}
