using OrderService.Data;
using OrderService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace OrderService.Repositories;

/// <summary>
/// Repository implementation for DeliveryAddress entity
/// </summary>
public class DeliveryAddressRepository : IDeliveryAddressRepository
{
    private readonly OrderServiceDbContext _context;

    public DeliveryAddressRepository(OrderServiceDbContext context)
    {
        _context = context;
    }

    public async Task<DeliveryAddress?> GetByIdAsync(Guid id)
    {
        return await _context.DeliveryAddresses
            .FirstOrDefaultAsync(a => a.Id == id && a.IsActive);
    }

    public async Task<IEnumerable<DeliveryAddress>> GetByCustomerIdAsync(Guid customerId)
    {
        return await _context.DeliveryAddresses
            .Where(a => a.CustomerId == customerId && a.IsActive)
            .OrderByDescending(a => a.IsDefault)
            .ThenByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<DeliveryAddress?> GetDefaultByCustomerIdAsync(Guid customerId)
    {
        return await _context.DeliveryAddresses
            .FirstOrDefaultAsync(a => a.CustomerId == customerId && a.IsDefault && a.IsActive);
    }

    public async Task<DeliveryAddress> CreateAsync(DeliveryAddress address)
    {
        address.CreatedAt = DateTime.UtcNow;
        address.UpdatedAt = DateTime.UtcNow;

        // If this is set as default, unset all other defaults for this customer
        if (address.IsDefault)
        {
            var existingDefaults = await _context.DeliveryAddresses
                .Where(a => a.CustomerId == address.CustomerId && a.IsDefault && a.IsActive)
                .ToListAsync();

            foreach (var existing in existingDefaults)
            {
                existing.IsDefault = false;
                existing.UpdatedAt = DateTime.UtcNow;
            }
        }

        _context.DeliveryAddresses.Add(address);
        await _context.SaveChangesAsync();

        return address;
    }

    public async Task<DeliveryAddress> UpdateAsync(DeliveryAddress address)
    {
        address.UpdatedAt = DateTime.UtcNow;

        // If this is set as default, unset all other defaults for this customer
        if (address.IsDefault)
        {
            var existingDefaults = await _context.DeliveryAddresses
                .Where(a => a.CustomerId == address.CustomerId && a.Id != address.Id && a.IsDefault && a.IsActive)
                .ToListAsync();

            foreach (var existing in existingDefaults)
            {
                existing.IsDefault = false;
                existing.UpdatedAt = DateTime.UtcNow;
            }
        }

        _context.DeliveryAddresses.Update(address);
        await _context.SaveChangesAsync();

        return address;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var address = await _context.DeliveryAddresses.FindAsync(id);
        if (address == null)
            return false;

        address.IsActive = false;
        address.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> SetAsDefaultAsync(Guid id, Guid customerId)
    {
        var address = await _context.DeliveryAddresses
            .FirstOrDefaultAsync(a => a.Id == id && a.CustomerId == customerId && a.IsActive);

        if (address == null)
            return false;

        // Unset all other defaults
        var existingDefaults = await _context.DeliveryAddresses
            .Where(a => a.CustomerId == customerId && a.Id != id && a.IsDefault && a.IsActive)
            .ToListAsync();

        foreach (var existing in existingDefaults)
        {
            existing.IsDefault = false;
            existing.UpdatedAt = DateTime.UtcNow;
        }

        address.IsDefault = true;
        address.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }
}
