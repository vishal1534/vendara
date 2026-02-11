using Microsoft.EntityFrameworkCore;
using IdentityService.Data;
using IdentityService.Models.Entities;

namespace IdentityService.Repositories;

public interface IAddressRepository
{
    Task<DeliveryAddress?> GetByIdAsync(Guid id);
    Task<List<DeliveryAddress>> GetByBuyerProfileIdAsync(Guid buyerProfileId);
    Task<DeliveryAddress?> GetDefaultAddressAsync(Guid buyerProfileId);
    Task<DeliveryAddress> CreateAsync(DeliveryAddress address);
    Task<DeliveryAddress> UpdateAsync(DeliveryAddress address);
    Task DeleteAsync(Guid id);
    Task SetDefaultAddressAsync(Guid buyerProfileId, Guid addressId);
}

public class AddressRepository : IAddressRepository
{
    private readonly IdentityServiceDbContext _context;

    public AddressRepository(IdentityServiceDbContext context)
    {
        _context = context;
    }

    public async Task<DeliveryAddress?> GetByIdAsync(Guid id)
    {
        return await _context.DeliveryAddresses
            .FirstOrDefaultAsync(a => a.Id == id && !a.IsDeleted);
    }

    public async Task<List<DeliveryAddress>> GetByBuyerProfileIdAsync(Guid buyerProfileId)
    {
        return await _context.DeliveryAddresses
            .Where(a => a.BuyerProfileId == buyerProfileId && !a.IsDeleted)
            .OrderByDescending(a => a.IsDefault)
            .ThenByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<DeliveryAddress?> GetDefaultAddressAsync(Guid buyerProfileId)
    {
        return await _context.DeliveryAddresses
            .FirstOrDefaultAsync(a => a.BuyerProfileId == buyerProfileId && a.IsDefault && !a.IsDeleted);
    }

    public async Task<DeliveryAddress> CreateAsync(DeliveryAddress address)
    {
        address.CreatedAt = DateTime.UtcNow;

        // If this is set as default, unset other default addresses
        if (address.IsDefault)
        {
            await UnsetDefaultAddressesAsync(address.BuyerProfileId);
        }

        _context.DeliveryAddresses.Add(address);
        await _context.SaveChangesAsync();
        return address;
    }

    public async Task<DeliveryAddress> UpdateAsync(DeliveryAddress address)
    {
        address.UpdatedAt = DateTime.UtcNow;

        // If this is set as default, unset other default addresses
        if (address.IsDefault)
        {
            await UnsetDefaultAddressesAsync(address.BuyerProfileId, address.Id);
        }

        _context.DeliveryAddresses.Update(address);
        await _context.SaveChangesAsync();
        return address;
    }

    public async Task DeleteAsync(Guid id)
    {
        var address = await _context.DeliveryAddresses.FindAsync(id);
        if (address != null)
        {
            address.IsDeleted = true;
            address.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    public async Task SetDefaultAddressAsync(Guid buyerProfileId, Guid addressId)
    {
        // Unset all default addresses for this buyer
        await UnsetDefaultAddressesAsync(buyerProfileId);

        // Set the specified address as default
        var address = await _context.DeliveryAddresses.FindAsync(addressId);
        if (address != null && address.BuyerProfileId == buyerProfileId)
        {
            address.IsDefault = true;
            address.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    private async Task UnsetDefaultAddressesAsync(Guid buyerProfileId, Guid? excludeAddressId = null)
    {
        var defaultAddresses = await _context.DeliveryAddresses
            .Where(a => a.BuyerProfileId == buyerProfileId 
                && a.IsDefault 
                && !a.IsDeleted
                && (excludeAddressId == null || a.Id != excludeAddressId))
            .ToListAsync();

        foreach (var addr in defaultAddresses)
        {
            addr.IsDefault = false;
            addr.UpdatedAt = DateTime.UtcNow;
        }

        if (defaultAddresses.Any())
        {
            await _context.SaveChangesAsync();
        }
    }
}
