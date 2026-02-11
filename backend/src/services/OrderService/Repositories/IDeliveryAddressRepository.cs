using OrderService.Models.Entities;

namespace OrderService.Repositories;

/// <summary>
/// Repository interface for DeliveryAddress entity
/// </summary>
public interface IDeliveryAddressRepository
{
    Task<DeliveryAddress?> GetByIdAsync(Guid id);
    Task<IEnumerable<DeliveryAddress>> GetByCustomerIdAsync(Guid customerId);
    Task<DeliveryAddress?> GetDefaultByCustomerIdAsync(Guid customerId);
    Task<DeliveryAddress> CreateAsync(DeliveryAddress address);
    Task<DeliveryAddress> UpdateAsync(DeliveryAddress address);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> SetAsDefaultAsync(Guid id, Guid customerId);
}
