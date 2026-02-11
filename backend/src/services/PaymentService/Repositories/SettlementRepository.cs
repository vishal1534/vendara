using Microsoft.EntityFrameworkCore;
using PaymentService.Data;
using PaymentService.Models.Entities;

namespace PaymentService.Repositories;

public class SettlementRepository : ISettlementRepository
{
    private readonly PaymentDbContext _context;

    public SettlementRepository(PaymentDbContext context)
    {
        _context = context;
    }

    public async Task<VendorSettlement?> GetByIdAsync(Guid id)
    {
        return await _context.VendorSettlements
            .Include(s => s.LineItems)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<List<VendorSettlement>> GetByVendorIdAsync(Guid vendorId, int page, int pageSize)
    {
        return await _context.VendorSettlements
            .Where(s => s.VendorId == vendorId)
            .OrderByDescending(s => s.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<List<VendorSettlement>> GetAllAsync(int page, int pageSize, string? status = null)
    {
        var query = _context.VendorSettlements.AsQueryable();

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(s => s.SettlementStatus == status);
        }

        return await query
            .OrderByDescending(s => s.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<VendorSettlement> CreateAsync(VendorSettlement settlement)
    {
        _context.VendorSettlements.Add(settlement);
        await _context.SaveChangesAsync();
        return settlement;
    }

    public async Task<VendorSettlement> UpdateAsync(VendorSettlement settlement)
    {
        settlement.UpdatedAt = DateTime.UtcNow;
        _context.VendorSettlements.Update(settlement);
        await _context.SaveChangesAsync();
        return settlement;
    }

    public async Task<int> GetTotalCountAsync(string? status = null)
    {
        var query = _context.VendorSettlements.AsQueryable();

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(s => s.SettlementStatus == status);
        }

        return await query.CountAsync();
    }

    public async Task<int> GetVendorSettlementCountAsync(Guid vendorId)
    {
        return await _context.VendorSettlements
            .Where(s => s.VendorId == vendorId)
            .CountAsync();
    }

    public async Task<List<SettlementLineItem>> GetLineItemsBySettlementIdAsync(Guid settlementId)
    {
        return await _context.SettlementLineItems
            .Where(li => li.SettlementId == settlementId)
            .OrderBy(li => li.OrderDate)
            .ToListAsync();
    }

    public async Task<SettlementLineItem> CreateLineItemAsync(SettlementLineItem lineItem)
    {
        _context.SettlementLineItems.Add(lineItem);
        await _context.SaveChangesAsync();
        return lineItem;
    }
}
