using CatalogService.Data;
using CatalogService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace CatalogService.Repositories;

public interface IVendorInventoryRepository
{
    Task<VendorInventory?> GetByIdAsync(Guid id);
    Task<VendorInventory?> GetByVendorAndMaterialAsync(Guid vendorId, Guid materialId);
    Task<List<VendorInventory>> GetByVendorAsync(Guid vendorId, bool includeInactive = false);
    Task<List<VendorInventory>> GetByVendorIdAsync(Guid vendorId); // Alias for GetByVendorAsync
    Task<List<VendorInventory>> GetByMaterialAsync(Guid materialId, bool availableOnly = true);
    Task<VendorInventory> CreateAsync(VendorInventory inventory);
    Task<VendorInventory> UpdateAsync(VendorInventory inventory);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> UpdateAvailabilityAsync(Guid vendorId, Guid materialId, bool isAvailable);
}

public class VendorInventoryRepository : IVendorInventoryRepository
{
    private readonly CatalogServiceDbContext _context;

    public VendorInventoryRepository(CatalogServiceDbContext context)
    {
        _context = context;
    }

    public async Task<VendorInventory?> GetByIdAsync(Guid id)
    {
        return await _context.VendorInventories
            .Include(vi => vi.Material)
                .ThenInclude(m => m.Category)
            .FirstOrDefaultAsync(vi => vi.Id == id);
    }

    public async Task<VendorInventory?> GetByVendorAndMaterialAsync(Guid vendorId, Guid materialId)
    {
        return await _context.VendorInventories
            .Include(vi => vi.Material)
                .ThenInclude(m => m.Category)
            .FirstOrDefaultAsync(vi => vi.VendorId == vendorId && vi.MaterialId == materialId);
    }

    public async Task<List<VendorInventory>> GetByVendorAsync(Guid vendorId, bool includeInactive = false)
    {
        var query = _context.VendorInventories
            .Include(vi => vi.Material)
                .ThenInclude(m => m.Category)
            .Where(vi => vi.VendorId == vendorId);

        if (!includeInactive)
        {
            query = query.Where(vi => vi.IsAvailable);
        }

        return await query.ToListAsync();
    }

    public async Task<List<VendorInventory>> GetByVendorIdAsync(Guid vendorId)
    {
        return await GetByVendorAsync(vendorId);
    }

    public async Task<List<VendorInventory>> GetByMaterialAsync(Guid materialId, bool availableOnly = true)
    {
        var query = _context.VendorInventories
            .Include(vi => vi.Material)
            .Where(vi => vi.MaterialId == materialId);

        if (availableOnly)
        {
            query = query.Where(vi => vi.IsAvailable);
        }

        return await query.ToListAsync();
    }

    public async Task<VendorInventory> CreateAsync(VendorInventory inventory)
    {
        inventory.CreatedAt = DateTime.UtcNow;
        inventory.UpdatedAt = DateTime.UtcNow;
        inventory.LastUpdated = DateTime.UtcNow;

        _context.VendorInventories.Add(inventory);
        await _context.SaveChangesAsync();
        return inventory;
    }

    public async Task<VendorInventory> UpdateAsync(VendorInventory inventory)
    {
        inventory.UpdatedAt = DateTime.UtcNow;
        inventory.LastUpdated = DateTime.UtcNow;

        _context.VendorInventories.Update(inventory);
        await _context.SaveChangesAsync();
        return inventory;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var inventory = await _context.VendorInventories.FindAsync(id);
        if (inventory == null)
            return false;

        _context.VendorInventories.Remove(inventory);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UpdateAvailabilityAsync(Guid vendorId, Guid materialId, bool isAvailable)
    {
        var inventory = await GetByVendorAndMaterialAsync(vendorId, materialId);
        if (inventory == null)
            return false;

        inventory.IsAvailable = isAvailable;
        inventory.LastUpdated = DateTime.UtcNow;
        inventory.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }
}