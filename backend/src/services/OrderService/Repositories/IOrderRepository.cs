using OrderService.Models.Entities;
using OrderService.Models.Enums;

namespace OrderService.Repositories;

/// <summary>
/// Repository interface for Order entity
/// </summary>
public interface IOrderRepository
{
    Task<Order?> GetByIdAsync(Guid id, bool includeDetails = false);
    Task<Order?> GetByOrderNumberAsync(string orderNumber, bool includeDetails = false);
    Task<IEnumerable<Order>> GetAllAsync(bool includeDetails = false);
    Task<IEnumerable<Order>> GetByCustomerIdAsync(Guid customerId, bool includeDetails = false);
    Task<IEnumerable<Order>> GetByVendorIdAsync(Guid vendorId, bool includeDetails = false);
    Task<IEnumerable<Order>> GetByStatusAsync(OrderStatus status, bool includeDetails = false);
    Task<IEnumerable<Order>> GetByCustomerAndStatusAsync(Guid customerId, OrderStatus status);
    Task<IEnumerable<Order>> GetByVendorAndStatusAsync(Guid vendorId, OrderStatus status);
    Task<IEnumerable<Order>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<Order> CreateAsync(Order order);
    Task<Order> UpdateAsync(Order order);
    Task<bool> DeleteAsync(Guid id);
    Task<int> GetCustomerOrderCountAsync(Guid customerId);
    Task<int> GetVendorOrderCountAsync(Guid vendorId);
    Task<decimal> GetCustomerTotalSpentAsync(Guid customerId);
    Task<decimal> GetVendorTotalRevenueAsync(Guid vendorId);
    Task<string> GenerateOrderNumberAsync();
}
