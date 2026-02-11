using Microsoft.EntityFrameworkCore;
using VendorService.Data;
using VendorService.Models.Entities;

namespace VendorService.Repositories;

/// <summary>
/// Repository implementation for VendorBusinessHour operations
/// </summary>
public class VendorBusinessHourRepository : IVendorBusinessHourRepository
{
    private readonly VendorDbContext _context;
    private readonly ILogger<VendorBusinessHourRepository> _logger;

    public VendorBusinessHourRepository(VendorDbContext context, ILogger<VendorBusinessHourRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<VendorBusinessHour>> GetByVendorIdAsync(Guid vendorId)
    {
        return await _context.VendorBusinessHours
            .Where(h => h.VendorId == vendorId)
            .OrderBy(h => h.DayOfWeek)
            .ToListAsync();
    }

    public async Task CreateBulkAsync(IEnumerable<VendorBusinessHour> hours)
    {
        _context.VendorBusinessHours.AddRange(hours);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteByVendorIdAsync(Guid vendorId)
    {
        var existingHours = await _context.VendorBusinessHours
            .Where(h => h.VendorId == vendorId)
            .ToListAsync();

        _context.VendorBusinessHours.RemoveRange(existingHours);
        await _context.SaveChangesAsync();
    }
}
