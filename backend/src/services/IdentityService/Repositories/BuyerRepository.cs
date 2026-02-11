using Microsoft.EntityFrameworkCore;
using IdentityService.Data;
using IdentityService.Models.Entities;

namespace IdentityService.Repositories;

public interface IBuyerRepository
{
    Task<BuyerProfile?> GetByIdAsync(Guid id);
    Task<BuyerProfile?> GetByUserIdAsync(Guid userId);
    Task<BuyerProfile> CreateAsync(BuyerProfile buyerProfile);
    Task<BuyerProfile> UpdateAsync(BuyerProfile buyerProfile);
    Task DeleteAsync(Guid id);
}

public class BuyerRepository : IBuyerRepository
{
    private readonly IdentityServiceDbContext _context;

    public BuyerRepository(IdentityServiceDbContext context)
    {
        _context = context;
    }

    public async Task<BuyerProfile?> GetByIdAsync(Guid id)
    {
        return await _context.BuyerProfiles
            .Include(b => b.User)
            .Include(b => b.DeliveryAddresses.Where(a => !a.IsDeleted))
            .FirstOrDefaultAsync(b => b.Id == id && !b.IsDeleted);
    }

    public async Task<BuyerProfile?> GetByUserIdAsync(Guid userId)
    {
        return await _context.BuyerProfiles
            .Include(b => b.User)
            .Include(b => b.DeliveryAddresses.Where(a => !a.IsDeleted))
            .FirstOrDefaultAsync(b => b.UserId == userId && !b.IsDeleted);
    }

    public async Task<BuyerProfile> CreateAsync(BuyerProfile buyerProfile)
    {
        buyerProfile.CreatedAt = DateTime.UtcNow;
        _context.BuyerProfiles.Add(buyerProfile);
        await _context.SaveChangesAsync();
        return buyerProfile;
    }

    public async Task<BuyerProfile> UpdateAsync(BuyerProfile buyerProfile)
    {
        buyerProfile.UpdatedAt = DateTime.UtcNow;
        _context.BuyerProfiles.Update(buyerProfile);
        await _context.SaveChangesAsync();
        return buyerProfile;
    }

    public async Task DeleteAsync(Guid id)
    {
        var buyerProfile = await _context.BuyerProfiles.FindAsync(id);
        if (buyerProfile != null)
        {
            buyerProfile.IsDeleted = true;
            buyerProfile.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }
}
