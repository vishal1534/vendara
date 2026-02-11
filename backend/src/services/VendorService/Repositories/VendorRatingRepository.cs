using Microsoft.EntityFrameworkCore;
using VendorService.Data;
using VendorService.Models.Entities;

namespace VendorService.Repositories;

/// <summary>
/// Repository implementation for VendorRating operations
/// </summary>
public class VendorRatingRepository : IVendorRatingRepository
{
    private readonly VendorDbContext _context;
    private readonly ILogger<VendorRatingRepository> _logger;

    public VendorRatingRepository(VendorDbContext context, ILogger<VendorRatingRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<VendorRating?> GetByIdAsync(Guid id)
    {
        return await _context.VendorRatings.FindAsync(id);
    }

    public async Task<IEnumerable<VendorRating>> GetByVendorIdAsync(Guid vendorId, int page, int pageSize)
    {
        return await _context.VendorRatings
            .Where(r => r.VendorId == vendorId && r.IsPublic && r.IsApproved)
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<VendorRating?> GetByOrderIdAsync(Guid orderId)
    {
        return await _context.VendorRatings
            .FirstOrDefaultAsync(r => r.OrderId == orderId);
    }

    public async Task<(decimal averageRating, int totalCount)> GetVendorRatingSummaryAsync(Guid vendorId)
    {
        var ratings = await _context.VendorRatings
            .Where(r => r.VendorId == vendorId && r.IsApproved)
            .ToListAsync();

        if (!ratings.Any())
            return (0, 0);

        var average = ratings.Average(r => r.Rating);
        return (Math.Round(average, 2), ratings.Count);
    }

    public async Task<VendorRating> CreateAsync(VendorRating rating)
    {
        rating.CreatedAt = DateTime.UtcNow;
        rating.UpdatedAt = DateTime.UtcNow;
        
        _context.VendorRatings.Add(rating);
        await _context.SaveChangesAsync();
        
        return rating;
    }

    public async Task<VendorRating> UpdateAsync(VendorRating rating)
    {
        rating.UpdatedAt = DateTime.UtcNow;
        
        _context.VendorRatings.Update(rating);
        await _context.SaveChangesAsync();
        
        return rating;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var rating = await _context.VendorRatings.FindAsync(id);
        if (rating == null)
            return false;

        _context.VendorRatings.Remove(rating);
        await _context.SaveChangesAsync();
        
        return true;
    }
}
