using OrderService.Data;
using OrderService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace OrderService.Repositories;

/// <summary>
/// Repository implementation for OrderStatusHistory entity
/// </summary>
public class OrderStatusHistoryRepository : IOrderStatusHistoryRepository
{
    private readonly OrderServiceDbContext _context;

    public OrderStatusHistoryRepository(OrderServiceDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<OrderStatusHistory>> GetByOrderIdAsync(Guid orderId)
    {
        return await _context.OrderStatusHistories
            .Where(h => h.OrderId == orderId)
            .OrderByDescending(h => h.ChangedAt)
            .ToListAsync();
    }

    public async Task<OrderStatusHistory> CreateAsync(OrderStatusHistory statusHistory)
    {
        statusHistory.ChangedAt = DateTime.UtcNow;

        _context.OrderStatusHistories.Add(statusHistory);
        await _context.SaveChangesAsync();

        return statusHistory;
    }
}
