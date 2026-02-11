using Microsoft.EntityFrameworkCore;
using PaymentService.Data;
using PaymentService.Models.Entities;

namespace PaymentService.Repositories;

public class PaymentRepository : IPaymentRepository
{
    private readonly PaymentDbContext _context;

    public PaymentRepository(PaymentDbContext context)
    {
        _context = context;
    }

    public async Task<Payment?> GetByIdAsync(Guid id)
    {
        return await _context.Payments
            .Include(p => p.Refunds)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Payment?> GetByOrderIdAsync(Guid orderId)
    {
        return await _context.Payments
            .Include(p => p.Refunds)
            .FirstOrDefaultAsync(p => p.OrderId == orderId);
    }

    public async Task<Payment?> GetByRazorpayOrderIdAsync(string razorpayOrderId)
    {
        return await _context.Payments
            .FirstOrDefaultAsync(p => p.RazorpayOrderId == razorpayOrderId);
    }

    public async Task<List<Payment>> GetByBuyerIdAsync(Guid buyerId, int page, int pageSize)
    {
        return await _context.Payments
            .Where(p => p.BuyerId == buyerId)
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<List<Payment>> GetByVendorIdAsync(Guid vendorId, int page, int pageSize)
    {
        return await _context.Payments
            .Where(p => p.VendorId == vendorId)
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<List<Payment>> GetAllAsync(int page, int pageSize, string? status = null)
    {
        var query = _context.Payments.AsQueryable();

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(p => p.PaymentStatus == status);
        }

        return await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<Payment> CreateAsync(Payment payment)
    {
        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();
        return payment;
    }

    public async Task<Payment> UpdateAsync(Payment payment)
    {
        payment.UpdatedAt = DateTime.UtcNow;
        _context.Payments.Update(payment);
        await _context.SaveChangesAsync();
        return payment;
    }

    public async Task<int> GetTotalCountAsync(string? status = null)
    {
        var query = _context.Payments.AsQueryable();

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(p => p.PaymentStatus == status);
        }

        return await query.CountAsync();
    }

    public async Task<int> GetBuyerPaymentCountAsync(Guid buyerId)
    {
        return await _context.Payments
            .Where(p => p.BuyerId == buyerId)
            .CountAsync();
    }

    public async Task<int> GetVendorPaymentCountAsync(Guid vendorId)
    {
        return await _context.Payments
            .Where(p => p.VendorId == vendorId)
            .CountAsync();
    }

    public async Task<List<Payment>> GetCompletedPaymentsByVendorAsync(Guid vendorId, DateTime startDate, DateTime endDate)
    {
        return await _context.Payments
            .Where(p => p.VendorId == vendorId 
                && p.PaymentStatus == "success"
                && p.CompletedAt >= startDate 
                && p.CompletedAt <= endDate)
            .ToListAsync();
    }

    public async Task<decimal> GetTotalRevenueAsync(DateTime? startDate = null, DateTime? endDate = null)
    {
        var query = _context.Payments
            .Where(p => p.PaymentStatus == "success");

        if (startDate.HasValue)
        {
            query = query.Where(p => p.CompletedAt >= startDate);
        }

        if (endDate.HasValue)
        {
            query = query.Where(p => p.CompletedAt <= endDate);
        }

        return await query.SumAsync(p => (decimal?)p.Amount) ?? 0;
    }
}
