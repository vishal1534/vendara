using Microsoft.EntityFrameworkCore;
using VendorService.Data;
using VendorService.Models.Entities;

namespace VendorService.Repositories;

/// <summary>
/// Repository implementation for VendorInventoryItem operations
/// </summary>
public class VendorInventoryRepository : IVendorInventoryRepository
{
    private readonly VendorDbContext _context;
    private readonly ILogger<VendorInventoryRepository> _logger;

    public VendorInventoryRepository(VendorDbContext context, ILogger<VendorInventoryRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<VendorInventoryItem?> GetByIdAsync(Guid id)
    {
        return await _context.VendorInventoryItems.FindAsync(id);
    }

    public async Task<IEnumerable<VendorInventoryItem>> GetByVendorIdAsync(Guid vendorId)
    {
        return await _context.VendorInventoryItems
            .Where(i => i.VendorId == vendorId)
            .OrderBy(i => i.CreatedAt)
            .ToListAsync();
    }

    public async Task<VendorInventoryItem?> GetByVendorAndMaterialAsync(Guid vendorId, Guid materialId)
    {
        return await _context.VendorInventoryItems
            .FirstOrDefaultAsync(i => i.VendorId == vendorId && i.MaterialId == materialId);
    }

    public async Task<IEnumerable<VendorInventoryItem>> GetAvailableByVendorIdAsync(Guid vendorId)
    {
        return await _context.VendorInventoryItems
            .Where(i => i.VendorId == vendorId && i.IsAvailable && i.IsInStock)
            .OrderBy(i => i.CreatedAt)
            .ToListAsync();
    }

    public async Task<VendorInventoryItem> CreateAsync(VendorInventoryItem item)
    {
        item.CreatedAt = DateTime.UtcNow;
        item.UpdatedAt = DateTime.UtcNow;
        
        _context.VendorInventoryItems.Add(item);
        await _context.SaveChangesAsync();
        
        return item;
    }

    public async Task<VendorInventoryItem> UpdateAsync(VendorInventoryItem item)
    {
        item.UpdatedAt = DateTime.UtcNow;
        
        _context.VendorInventoryItems.Update(item);
        await _context.SaveChangesAsync();
        
        return item;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var item = await _context.VendorInventoryItems.FindAsync(id);
        if (item == null)
            return false;

        _context.VendorInventoryItems.Remove(item);
        await _context.SaveChangesAsync();
        
        return true;
    }

    public async Task<bool> ExistsAsync(Guid vendorId, Guid materialId)
    {
        return await _context.VendorInventoryItems
            .AnyAsync(i => i.VendorId == vendorId && i.MaterialId == materialId);
    }
}
