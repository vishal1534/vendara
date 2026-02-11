using Microsoft.EntityFrameworkCore;
using VendorService.Data;
using VendorService.Models.Entities;

namespace VendorService.Repositories;

/// <summary>
/// Repository implementation for VendorServiceArea operations
/// </summary>
public class VendorServiceAreaRepository : IVendorServiceAreaRepository
{
    private readonly VendorDbContext _context;
    private readonly ILogger<VendorServiceAreaRepository> _logger;

    public VendorServiceAreaRepository(VendorDbContext context, ILogger<VendorServiceAreaRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<VendorServiceArea?> GetByIdAsync(Guid id)
    {
        return await _context.VendorServiceAreas.FindAsync(id);
    }

    public async Task<IEnumerable<VendorServiceArea>> GetByVendorIdAsync(Guid vendorId)
    {
        return await _context.VendorServiceAreas
            .Where(a => a.VendorId == vendorId)
            .OrderBy(a => a.AreaName)
            .ToListAsync();
    }

    public async Task<IEnumerable<VendorServiceArea>> GetActiveByVendorIdAsync(Guid vendorId)
    {
        return await _context.VendorServiceAreas
            .Where(a => a.VendorId == vendorId && a.IsActive)
            .OrderBy(a => a.AreaName)
            .ToListAsync();
    }

    public async Task<VendorServiceArea> CreateAsync(VendorServiceArea serviceArea)
    {
        serviceArea.CreatedAt = DateTime.UtcNow;
        
        _context.VendorServiceAreas.Add(serviceArea);
        await _context.SaveChangesAsync();
        
        return serviceArea;
    }

    public async Task<VendorServiceArea> UpdateAsync(VendorServiceArea serviceArea)
    {
        _context.VendorServiceAreas.Update(serviceArea);
        await _context.SaveChangesAsync();
        
        return serviceArea;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var serviceArea = await _context.VendorServiceAreas.FindAsync(id);
        if (serviceArea == null)
            return false;

        _context.VendorServiceAreas.Remove(serviceArea);
        await _context.SaveChangesAsync();
        
        return true;
    }
}
