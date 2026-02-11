using Microsoft.AspNetCore.Mvc;
using OrderService.Models.Enums;
using OrderService.Repositories;

namespace OrderService.Controllers;

[ApiController]
[Route("api/v1/reports/orders")]
public class OrderReportsController : ControllerBase
{
    private readonly IOrderRepository _orderRepository;
    private readonly ILogger<OrderReportsController> _logger;

    public OrderReportsController(
        IOrderRepository orderRepository,
        ILogger<OrderReportsController> logger)
    {
        _orderRepository = orderRepository;
        _logger = logger;
    }

    /// <summary>
    /// Get orders by date range
    /// </summary>
    [HttpGet("by-date-range")]
    public async Task<IActionResult> GetOrdersByDateRange(
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate)
    {
        try
        {
            var orders = await _orderRepository.GetByDateRangeAsync(startDate, endDate);

            var summary = new
            {
                totalOrders = orders.Count(),
                totalRevenue = orders
                    .Where(o => o.Status == OrderStatus.Completed || o.Status == OrderStatus.Delivered)
                    .Sum(o => o.TotalAmount),
                averageOrderValue = orders.Any() 
                    ? orders.Average(o => o.TotalAmount) 
                    : 0,
                ordersByStatus = orders.GroupBy(o => o.Status)
                    .Select(g => new { status = g.Key.ToString(), count = g.Count() }),
                ordersByType = orders.GroupBy(o => o.OrderType)
                    .Select(g => new { type = g.Key.ToString(), count = g.Count() })
            };

            return Ok(new
            {
                success = true,
                data = new
                {
                    orders,
                    summary
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting orders by date range");
            return StatusCode(500, new { success = false, message = "An error occurred while fetching order report" });
        }
    }

    /// <summary>
    /// Get orders by status
    /// </summary>
    [HttpGet("by-status/{status}")]
    public async Task<IActionResult> GetOrdersByStatus(OrderStatus status)
    {
        try
        {
            var orders = await _orderRepository.GetByStatusAsync(status, includeDetails: true);

            return Ok(new
            {
                success = true,
                data = orders,
                count = orders.Count(),
                totalValue = orders.Sum(o => o.TotalAmount)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting orders by status {Status}", status);
            return StatusCode(500, new { success = false, message = "An error occurred while fetching orders" });
        }
    }

    /// <summary>
    /// Get daily order summary
    /// </summary>
    [HttpGet("daily-summary")]
    public async Task<IActionResult> GetDailySummary([FromQuery] DateTime? date = null)
    {
        try
        {
            var targetDate = date ?? DateTime.UtcNow;
            var startOfDay = targetDate.Date;
            var endOfDay = startOfDay.AddDays(1).AddTicks(-1);

            var orders = await _orderRepository.GetByDateRangeAsync(startOfDay, endOfDay);

            var summary = new
            {
                date = targetDate.ToString("yyyy-MM-dd"),
                totalOrders = orders.Count(),
                completedOrders = orders.Count(o => o.Status == OrderStatus.Completed || o.Status == OrderStatus.Delivered),
                pendingOrders = orders.Count(o => o.Status == OrderStatus.Pending),
                processingOrders = orders.Count(o => o.Status == OrderStatus.Processing || 
                                                      o.Status == OrderStatus.Confirmed ||
                                                      o.Status == OrderStatus.Ready),
                cancelledOrders = orders.Count(o => o.Status == OrderStatus.Cancelled),
                totalRevenue = orders
                    .Where(o => o.Status == OrderStatus.Completed || o.Status == OrderStatus.Delivered)
                    .Sum(o => o.TotalAmount),
                averageOrderValue = orders.Any() ? orders.Average(o => o.TotalAmount) : 0
            };

            return Ok(new
            {
                success = true,
                data = summary
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting daily order summary");
            return StatusCode(500, new { success = false, message = "An error occurred while fetching daily summary" });
        }
    }

    /// <summary>
    /// Get monthly order summary
    /// </summary>
    [HttpGet("monthly-summary")]
    public async Task<IActionResult> GetMonthlySummary([FromQuery] int? year = null, [FromQuery] int? month = null)
    {
        try
        {
            var targetYear = year ?? DateTime.UtcNow.Year;
            var targetMonth = month ?? DateTime.UtcNow.Month;

            var startOfMonth = new DateTime(targetYear, targetMonth, 1);
            var endOfMonth = startOfMonth.AddMonths(1).AddTicks(-1);

            var orders = await _orderRepository.GetByDateRangeAsync(startOfMonth, endOfMonth);

            var summary = new
            {
                year = targetYear,
                month = targetMonth,
                monthName = startOfMonth.ToString("MMMM yyyy"),
                totalOrders = orders.Count(),
                completedOrders = orders.Count(o => o.Status == OrderStatus.Completed || o.Status == OrderStatus.Delivered),
                cancelledOrders = orders.Count(o => o.Status == OrderStatus.Cancelled),
                totalRevenue = orders
                    .Where(o => o.Status == OrderStatus.Completed || o.Status == OrderStatus.Delivered)
                    .Sum(o => o.TotalAmount),
                averageOrderValue = orders.Any() ? orders.Average(o => o.TotalAmount) : 0,
                materialOrders = orders.Count(o => o.OrderType == OrderType.Material),
                laborOrders = orders.Count(o => o.OrderType == OrderType.Labor),
                combinedOrders = orders.Count(o => o.OrderType == OrderType.Combined)
            };

            return Ok(new
            {
                success = true,
                data = summary
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting monthly order summary");
            return StatusCode(500, new { success = false, message = "An error occurred while fetching monthly summary" });
        }
    }
}
