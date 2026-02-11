using CatalogService.Data;
using CatalogService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace CatalogService.Repositories;

public interface IVendorLaborAvailabilityRepository
{
    Task<VendorLaborAvailability?> GetByIdAsync(Guid id);
    Task<VendorLaborAvailability?> GetByVendorAndLaborCategoryAsync(Guid vendorId, Guid laborCategoryId);
    Task<List<VendorLaborAvailability>> GetByVendorAsync(Guid vendorId, bool includeInactive = false);
    Task<List<VendorLaborAvailability>> GetByVendorIdAsync(Guid vendorId); // Alias for GetByVendorAsync
    Task<List<VendorLaborAvailability>> GetByLaborCategoryAsync(Guid laborCategoryId, bool availableOnly = true);
    Task<VendorLaborAvailability> CreateAsync(VendorLaborAvailability availability);
    Task<VendorLaborAvailability> UpdateAsync(VendorLaborAvailability availability);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> UpdateAvailabilityAsync(Guid vendorId, Guid laborCategoryId, bool isAvailable);
}

public class VendorLaborAvailabilityRepository : IVendorLaborAvailabilityRepository
{
    private readonly CatalogServiceDbContext _context;

    public VendorLaborAvailabilityRepository(CatalogServiceDbContext context)
    {
        _context = context;
    }

    public async Task<VendorLaborAvailability?> GetByIdAsync(Guid id)
    {
        return await _context.VendorLaborAvailabilities
            .Include(vla => vla.LaborCategory)
                .ThenInclude(lc => lc.Category)
            .FirstOrDefaultAsync(vla => vla.Id == id);
    }

    public async Task<VendorLaborAvailability?> GetByVendorAndLaborCategoryAsync(Guid vendorId, Guid laborCategoryId)
    {
        return await _context.VendorLaborAvailabilities
            .Include(vla => vla.LaborCategory)
                .ThenInclude(lc => lc.Category)
            .FirstOrDefaultAsync(vla => vla.VendorId == vendorId && vla.LaborCategoryId == laborCategoryId);
    }

    public async Task<List<VendorLaborAvailability>> GetByVendorAsync(Guid vendorId, bool includeInactive = false)
    {
        var query = _context.VendorLaborAvailabilities
            .Include(vla => vla.LaborCategory)
                .ThenInclude(lc => lc.Category)
            .Where(vla => vla.VendorId == vendorId);

        if (!includeInactive)
        {
            query = query.Where(vla => vla.IsAvailable);
        }

        return await query.ToListAsync();
    }

    public async Task<List<VendorLaborAvailability>> GetByVendorIdAsync(Guid vendorId)
    {
        return await GetByVendorAsync(vendorId);
    }

    public async Task<List<VendorLaborAvailability>> GetByLaborCategoryAsync(Guid laborCategoryId, bool availableOnly = true)
    {
        var query = _context.VendorLaborAvailabilities
            .Include(vla => vla.LaborCategory)
            .Where(vla => vla.LaborCategoryId == laborCategoryId);

        if (availableOnly)
        {
            query = query.Where(vla => vla.IsAvailable);
        }

        return await query.ToListAsync();
    }

    public async Task<VendorLaborAvailability> CreateAsync(VendorLaborAvailability availability)
    {
        availability.CreatedAt = DateTime.UtcNow;
        availability.UpdatedAt = DateTime.UtcNow;

        _context.VendorLaborAvailabilities.Add(availability);
        await _context.SaveChangesAsync();
        return availability;
    }

    public async Task<VendorLaborAvailability> UpdateAsync(VendorLaborAvailability availability)
    {
        availability.UpdatedAt = DateTime.UtcNow;

        _context.VendorLaborAvailabilities.Update(availability);
        await _context.SaveChangesAsync();
        return availability;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var availability = await _context.VendorLaborAvailabilities.FindAsync(id);
        if (availability == null)
            return false;

        _context.VendorLaborAvailabilities.Remove(availability);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UpdateAvailabilityAsync(Guid vendorId, Guid laborCategoryId, bool isAvailable)
    {
        var availability = await GetByVendorAndLaborCategoryAsync(vendorId, laborCategoryId);
        if (availability == null)
            return false;

        availability.IsAvailable = isAvailable;
        availability.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }
}
