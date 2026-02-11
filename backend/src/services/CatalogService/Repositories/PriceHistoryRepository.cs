using CatalogService.Data;
using CatalogService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace CatalogService.Repositories;

public interface IPriceHistoryRepository
{
    Task<PriceHistory?> GetByIdAsync(Guid id);
    Task<List<PriceHistory>> GetByItemAsync(PriceHistoryItemType itemType, Guid itemId, int limit = 50);
    Task<List<PriceHistory>> GetByVendorAsync(Guid vendorId, int limit = 100);
    Task<List<PriceHistory>> GetRecentChangesAsync(int days = 30, int limit = 100);
    Task<PriceHistory> CreateAsync(PriceHistory priceHistory);
    Task<List<PriceHistory>> GetPriceHistoryByDateRangeAsync(DateTime startDate, DateTime endDate, PriceHistoryItemType? itemType = null);
}

public class PriceHistoryRepository : IPriceHistoryRepository
{
    private readonly CatalogServiceDbContext _context;

    public PriceHistoryRepository(CatalogServiceDbContext context)
    {
        _context = context;
    }

    public async Task<PriceHistory?> GetByIdAsync(Guid id)
    {
        return await _context.PriceHistories.FindAsync(id);
    }

    public async Task<List<PriceHistory>> GetByItemAsync(PriceHistoryItemType itemType, Guid itemId, int limit = 50)
    {
        return await _context.PriceHistories
            .Where(ph => ph.ItemType == itemType && ph.ItemId == itemId)
            .OrderByDescending(ph => ph.ChangedAt)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<List<PriceHistory>> GetByVendorAsync(Guid vendorId, int limit = 100)
    {
        return await _context.PriceHistories
            .Where(ph => ph.VendorId == vendorId)
            .OrderByDescending(ph => ph.ChangedAt)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<List<PriceHistory>> GetRecentChangesAsync(int days = 30, int limit = 100)
    {
        var cutoffDate = DateTime.UtcNow.AddDays(-days);
        return await _context.PriceHistories
            .Where(ph => ph.ChangedAt >= cutoffDate)
            .OrderByDescending(ph => ph.ChangedAt)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<PriceHistory> CreateAsync(PriceHistory priceHistory)
    {
        priceHistory.CreatedAt = DateTime.UtcNow;
        priceHistory.UpdatedAt = DateTime.UtcNow;
        priceHistory.ChangedAt = DateTime.UtcNow;

        _context.PriceHistories.Add(priceHistory);
        await _context.SaveChangesAsync();
        return priceHistory;
    }

    public async Task<List<PriceHistory>> GetPriceHistoryByDateRangeAsync(
        DateTime startDate, 
        DateTime endDate, 
        PriceHistoryItemType? itemType = null)
    {
        var query = _context.PriceHistories
            .Where(ph => ph.ChangedAt >= startDate && ph.ChangedAt <= endDate);

        if (itemType.HasValue)
        {
            query = query.Where(ph => ph.ItemType == itemType.Value);
        }

        return await query
            .OrderByDescending(ph => ph.ChangedAt)
            .ToListAsync();
    }
}
