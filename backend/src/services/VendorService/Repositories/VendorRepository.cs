using Microsoft.EntityFrameworkCore;
using VendorService.Data;
using VendorService.Models.Entities;
using VendorService.Models.Enums;

namespace VendorService.Repositories;

/// <summary>
/// Repository implementation for Vendor operations
/// </summary>
public class VendorRepository : IVendorRepository
{
    private readonly VendorDbContext _context;
    private readonly ILogger<VendorRepository> _logger;

    public VendorRepository(VendorDbContext context, ILogger<VendorRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Vendor?> GetByIdAsync(Guid id)
    {
        return await _context.Vendors
            .Include(v => v.ServiceAreas)
            .Include(v => v.BusinessHours)
            .FirstOrDefaultAsync(v => v.Id == id);
    }

    public async Task<Vendor?> GetByUserIdAsync(Guid userId)
    {
        return await _context.Vendors
            .Include(v => v.ServiceAreas)
            .Include(v => v.BusinessHours)
            .FirstOrDefaultAsync(v => v.UserId == userId);
    }

    public async Task<Vendor?> GetByEmailAsync(string email)
    {
        return await _context.Vendors.FirstOrDefaultAsync(v => v.Email == email);
    }

    public async Task<(IEnumerable<Vendor> vendors, int totalCount)> GetAllAsync(
        int page, int pageSize, VendorStatus? status = null, string? city = null, string? searchTerm = null)
    {
        var query = _context.Vendors.AsQueryable();

        if (status.HasValue)
            query = query.Where(v => v.Status == status.Value);

        if (!string.IsNullOrWhiteSpace(city))
            query = query.Where(v => v.City.ToLower() == city.ToLower());

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var search = searchTerm.ToLower();
            query = query.Where(v => 
                v.BusinessName.ToLower().Contains(search) ||
                v.ContactPersonName.ToLower().Contains(search) ||
                v.Email.ToLower().Contains(search));
        }

        var totalCount = await query.CountAsync();

        var vendors = await query
            .OrderByDescending(v => v.AverageRating)
            .ThenByDescending(v => v.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (vendors, totalCount);
    }

    public async Task<IEnumerable<Vendor>> SearchAsync(string searchTerm, string? city = null, int limit = 10)
    {
        var query = _context.Vendors
            .Where(v => v.Status == VendorStatus.Active && v.IsActive);

        if (!string.IsNullOrWhiteSpace(city))
            query = query.Where(v => v.City.ToLower() == city.ToLower());

        var search = searchTerm.ToLower();
        query = query.Where(v => 
            v.BusinessName.ToLower().Contains(search) ||
            v.SpecializationAreas!.ToLower().Contains(search));

        return await query
            .OrderByDescending(v => v.AverageRating)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<Vendor> CreateAsync(Vendor vendor)
    {
        vendor.CreatedAt = DateTime.UtcNow;
        vendor.UpdatedAt = DateTime.UtcNow;
        
        _context.Vendors.Add(vendor);
        await _context.SaveChangesAsync();
        
        return vendor;
    }

    public async Task<Vendor> UpdateAsync(Vendor vendor)
    {
        vendor.UpdatedAt = DateTime.UtcNow;
        
        _context.Vendors.Update(vendor);
        await _context.SaveChangesAsync();
        
        return vendor;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var vendor = await _context.Vendors.FindAsync(id);
        if (vendor == null)
            return false;

        vendor.IsActive = false;
        vendor.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        
        return true;
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Vendors.AnyAsync(v => v.Id == id);
    }

    public async Task<int> GetTotalCountAsync()
    {
        return await _context.Vendors.CountAsync();
    }

    public async Task<IEnumerable<Vendor>> GetTopRatedAsync(int limit = 10, string? city = null)
    {
        var query = _context.Vendors
            .Where(v => v.Status == VendorStatus.Active && v.IsActive && v.TotalRatings > 0);

        if (!string.IsNullOrWhiteSpace(city))
            query = query.Where(v => v.City.ToLower() == city.ToLower());

        return await query
            .OrderByDescending(v => v.AverageRating)
            .ThenByDescending(v => v.TotalRatings)
            .Take(limit)
            .ToListAsync();
    }
}
