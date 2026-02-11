using OrderService.Models.Entities;

namespace OrderService.Repositories;

/// <summary>
/// Repository interface for OrderStatusHistory entity
/// </summary>
public interface IOrderStatusHistoryRepository
{
    Task<IEnumerable<OrderStatusHistory>> GetByOrderIdAsync(Guid orderId);
    Task<OrderStatusHistory> CreateAsync(OrderStatusHistory statusHistory);
}
