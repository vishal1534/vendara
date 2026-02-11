using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using OrderService.Models.DTOs;
using OrderService.Models.Enums;
using OrderService.Models.Authorization;
using OrderService.Repositories;

namespace OrderService.Controllers;

[ApiController]
[Route("api/v1/customers/{customerId}/orders")]
[Authorize] // All endpoints require authentication
public class CustomerOrdersController : ControllerBase
{
    private readonly IOrderRepository _orderRepository;
    private readonly ILogger<CustomerOrdersController> _logger;

    public CustomerOrdersController(
        IOrderRepository orderRepository,
        ILogger<CustomerOrdersController> logger)
    {
        _orderRepository = orderRepository;
        _logger = logger;
    }

    /// <summary>
    /// Get all orders for a customer (Customer themselves or Admin)
    /// </summary>
    [HttpGet]
    [Authorize(Policy = AuthorizationPolicies.CustomerOrAdmin)]
    public async Task<IActionResult> GetCustomerOrders(Guid customerId, [FromQuery] bool includeDetails = true)
    {
        try
        {
            var orders = await _orderRepository.GetByCustomerIdAsync(customerId, includeDetails);

            return Ok(new
            {
                success = true,
                data = orders,
                count = orders.Count()
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting orders for customer {CustomerId}", customerId);
            return StatusCode(500, new { success = false, message = "An error occurred while fetching customer orders" });
        }
    }

    /// <summary>
    /// Get customer orders by status (Customer themselves or Admin)
    /// </summary>
    [HttpGet("by-status/{status}")]
    [Authorize(Policy = AuthorizationPolicies.CustomerOrAdmin)]
    public async Task<IActionResult> GetCustomerOrdersByStatus(Guid customerId, OrderStatus status)
    {
        try
        {
            var orders = await _orderRepository.GetByCustomerAndStatusAsync(customerId, status);

            return Ok(new
            {
                success = true,
                data = orders,
                count = orders.Count()
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting orders for customer {CustomerId} with status {Status}", customerId, status);
            return StatusCode(500, new { success = false, message = "An error occurred while fetching customer orders" });
        }
    }

    /// <summary>
    /// Get customer order statistics
    /// </summary>
    [HttpGet("stats")]
    public async Task<IActionResult> GetCustomerOrderStats(Guid customerId)
    {
        try
        {
            var totalOrders = await _orderRepository.GetCustomerOrderCountAsync(customerId);
            var totalSpent = await _orderRepository.GetCustomerTotalSpentAsync(customerId);

            var allOrders = await _orderRepository.GetByCustomerIdAsync(customerId, includeDetails: false);

            var pendingOrders = allOrders.Count(o => o.Status == OrderStatus.Pending);
            var confirmedOrders = allOrders.Count(o => o.Status == OrderStatus.Confirmed);
            var processingOrders = allOrders.Count(o => o.Status == OrderStatus.Processing);
            var dispatchedOrders = allOrders.Count(o => o.Status == OrderStatus.Dispatched);
            var completedOrders = allOrders.Count(o => o.Status == OrderStatus.Completed);
            var cancelledOrders = allOrders.Count(o => o.Status == OrderStatus.Cancelled);

            return Ok(new
            {
                success = true,
                data = new
                {
                    totalOrders,
                    totalSpent,
                    ordersByStatus = new
                    {
                        pending = pendingOrders,
                        confirmed = confirmedOrders,
                        processing = processingOrders,
                        dispatched = dispatchedOrders,
                        completed = completedOrders,
                        cancelled = cancelledOrders
                    }
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting stats for customer {CustomerId}", customerId);
            return StatusCode(500, new { success = false, message = "An error occurred while fetching customer statistics" });
        }
    }
}