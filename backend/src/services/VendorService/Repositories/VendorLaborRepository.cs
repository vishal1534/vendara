using Microsoft.EntityFrameworkCore;
using VendorService.Data;
using VendorService.Models.Entities;

namespace VendorService.Repositories;

/// <summary>
/// Repository implementation for VendorLaborAvailability operations
/// </summary>
public class VendorLaborRepository : IVendorLaborRepository
{
    private readonly VendorDbContext _context;
    private readonly ILogger<VendorLaborRepository> _logger;

    public VendorLaborRepository(VendorDbContext context, ILogger<VendorLaborRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<VendorLaborAvailability?> GetByIdAsync(Guid id)
    {
        return await _context.VendorLaborAvailability.FindAsync(id);
    }

    public async Task<IEnumerable<VendorLaborAvailability>> GetByVendorIdAsync(Guid vendorId)
    {
        return await _context.VendorLaborAvailability
            .Where(l => l.VendorId == vendorId)
            .OrderBy(l => l.LaborCategoryId)
            .ThenBy(l => l.SkillLevel)
            .ToListAsync();
    }

    public async Task<VendorLaborAvailability?> GetByVendorAndLaborCategoryAsync(Guid vendorId, Guid laborCategoryId, int skillLevel)
    {
        return await _context.VendorLaborAvailability
            .FirstOrDefaultAsync(l => 
                l.VendorId == vendorId && 
                l.LaborCategoryId == laborCategoryId && 
                l.SkillLevel == skillLevel);
    }

    public async Task<IEnumerable<VendorLaborAvailability>> GetAvailableByVendorIdAsync(Guid vendorId)
    {
        return await _context.VendorLaborAvailability
            .Where(l => l.VendorId == vendorId && l.IsAvailable && l.AvailableWorkers > 0)
            .OrderBy(l => l.LaborCategoryId)
            .ThenBy(l => l.SkillLevel)
            .ToListAsync();
    }

    public async Task<VendorLaborAvailability> CreateAsync(VendorLaborAvailability labor)
    {
        labor.CreatedAt = DateTime.UtcNow;
        labor.UpdatedAt = DateTime.UtcNow;
        
        _context.VendorLaborAvailability.Add(labor);
        await _context.SaveChangesAsync();
        
        return labor;
    }

    public async Task<VendorLaborAvailability> UpdateAsync(VendorLaborAvailability labor)
    {
        labor.UpdatedAt = DateTime.UtcNow;
        
        _context.VendorLaborAvailability.Update(labor);
        await _context.SaveChangesAsync();
        
        return labor;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var labor = await _context.VendorLaborAvailability.FindAsync(id);
        if (labor == null)
            return false;

        _context.VendorLaborAvailability.Remove(labor);
        await _context.SaveChangesAsync();
        
        return true;
    }
}
