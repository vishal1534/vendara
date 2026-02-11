using OrderService.Data;
using OrderService.Models.Entities;
using OrderService.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace OrderService.Repositories;

/// <summary>
/// Repository implementation for Order entity
/// </summary>
public class OrderRepository : IOrderRepository
{
    private readonly OrderServiceDbContext _context;

    public OrderRepository(OrderServiceDbContext context)
    {
        _context = context;
    }

    public async Task<Order?> GetByIdAsync(Guid id, bool includeDetails = false)
    {
        var query = _context.Orders.AsQueryable();

        if (includeDetails)
        {
            query = query
                .Include(o => o.OrderItems)
                .Include(o => o.LaborBookings)
                .Include(o => o.DeliveryAddress)
                .Include(o => o.Payment)
                .Include(o => o.Delivery)
                .Include(o => o.StatusHistory);
        }

        return await query.FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<Order?> GetByOrderNumberAsync(string orderNumber, bool includeDetails = false)
    {
        var query = _context.Orders.AsQueryable();

        if (includeDetails)
        {
            query = query
                .Include(o => o.OrderItems)
                .Include(o => o.LaborBookings)
                .Include(o => o.DeliveryAddress)
                .Include(o => o.Payment)
                .Include(o => o.Delivery)
                .Include(o => o.StatusHistory);
        }

        return await query.FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);
    }

    public async Task<IEnumerable<Order>> GetAllAsync(bool includeDetails = false)
    {
        var query = _context.Orders.AsQueryable();

        if (includeDetails)
        {
            query = query
                .Include(o => o.OrderItems)
                .Include(o => o.LaborBookings)
                .Include(o => o.DeliveryAddress)
                .Include(o => o.Payment)
                .Include(o => o.Delivery);
        }

        return await query.OrderByDescending(o => o.CreatedAt).ToListAsync();
    }

    public async Task<IEnumerable<Order>> GetByCustomerIdAsync(Guid customerId, bool includeDetails = false)
    {
        var query = _context.Orders.Where(o => o.CustomerId == customerId);

        if (includeDetails)
        {
            query = query
                .Include(o => o.OrderItems)
                .Include(o => o.LaborBookings)
                .Include(o => o.DeliveryAddress)
                .Include(o => o.Payment)
                .Include(o => o.Delivery);
        }

        return await query.OrderByDescending(o => o.CreatedAt).ToListAsync();
    }

    public async Task<IEnumerable<Order>> GetByVendorIdAsync(Guid vendorId, bool includeDetails = false)
    {
        var query = _context.Orders.Where(o => o.VendorId == vendorId);

        if (includeDetails)
        {
            query = query
                .Include(o => o.OrderItems)
                .Include(o => o.LaborBookings)
                .Include(o => o.DeliveryAddress)
                .Include(o => o.Payment)
                .Include(o => o.Delivery);
        }

        return await query.OrderByDescending(o => o.CreatedAt).ToListAsync();
    }

    public async Task<IEnumerable<Order>> GetByStatusAsync(OrderStatus status, bool includeDetails = false)
    {
        var query = _context.Orders.Where(o => o.Status == status);

        if (includeDetails)
        {
            query = query
                .Include(o => o.OrderItems)
                .Include(o => o.LaborBookings)
                .Include(o => o.DeliveryAddress)
                .Include(o => o.Payment)
                .Include(o => o.Delivery);
        }

        return await query.OrderByDescending(o => o.CreatedAt).ToListAsync();
    }

    public async Task<IEnumerable<Order>> GetByCustomerAndStatusAsync(Guid customerId, OrderStatus status)
    {
        return await _context.Orders
            .Where(o => o.CustomerId == customerId && o.Status == status)
            .Include(o => o.OrderItems)
            .Include(o => o.LaborBookings)
            .Include(o => o.Payment)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Order>> GetByVendorAndStatusAsync(Guid vendorId, OrderStatus status)
    {
        return await _context.Orders
            .Where(o => o.VendorId == vendorId && o.Status == status)
            .Include(o => o.OrderItems)
            .Include(o => o.LaborBookings)
            .Include(o => o.Payment)
            .Include(o => o.DeliveryAddress)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Order>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        return await _context.Orders
            .Where(o => o.CreatedAt >= startDate && o.CreatedAt <= endDate)
            .Include(o => o.OrderItems)
            .Include(o => o.LaborBookings)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<Order> CreateAsync(Order order)
    {
        order.CreatedAt = DateTime.UtcNow;
        order.UpdatedAt = DateTime.UtcNow;

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        return order;
    }

    public async Task<Order> UpdateAsync(Order order)
    {
        order.UpdatedAt = DateTime.UtcNow;

        _context.Orders.Update(order);
        await _context.SaveChangesAsync();

        return order;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null)
            return false;

        _context.Orders.Remove(order);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<int> GetCustomerOrderCountAsync(Guid customerId)
    {
        return await _context.Orders.CountAsync(o => o.CustomerId == customerId);
    }

    public async Task<int> GetVendorOrderCountAsync(Guid vendorId)
    {
        return await _context.Orders.CountAsync(o => o.VendorId == vendorId);
    }

    public async Task<decimal> GetCustomerTotalSpentAsync(Guid customerId)
    {
        return await _context.Orders
            .Where(o => o.CustomerId == customerId && 
                       (o.Status == OrderStatus.Completed || o.Status == OrderStatus.Delivered))
            .SumAsync(o => o.TotalAmount);
    }

    public async Task<decimal> GetVendorTotalRevenueAsync(Guid vendorId)
    {
        return await _context.Orders
            .Where(o => o.VendorId == vendorId && 
                       (o.Status == OrderStatus.Completed || o.Status == OrderStatus.Delivered))
            .SumAsync(o => o.TotalAmount);
    }

    public async Task<string> GenerateOrderNumberAsync()
    {
        var year = DateTime.UtcNow.Year;
        var count = await _context.Orders
            .Where(o => o.CreatedAt.Year == year)
            .CountAsync();

        return $"ORD-{year}-{(count + 1).ToString("D5")}";
    }
}
