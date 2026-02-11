using Microsoft.AspNetCore.Mvc;
using OrderService.Models.Enums;
using OrderService.Repositories;

namespace OrderService.Controllers;

[ApiController]
[Route("api/v1/vendors/{vendorId}/orders")]
public class VendorOrdersController : ControllerBase
{
    private readonly IOrderRepository _orderRepository;
    private readonly IOrderStatusHistoryRepository _orderStatusHistoryRepository;
    private readonly IOrderIssueRepository _orderIssueRepository;
    private readonly ILogger<VendorOrdersController> _logger;

    public VendorOrdersController(
        IOrderRepository orderRepository,
        IOrderStatusHistoryRepository orderStatusHistoryRepository,
        IOrderIssueRepository orderIssueRepository,
        ILogger<VendorOrdersController> logger)
    {
        _orderRepository = orderRepository;
        _orderStatusHistoryRepository = orderStatusHistoryRepository;
        _orderIssueRepository = orderIssueRepository;
        _logger = logger;
    }

    /// <summary>
    /// Get all orders for a vendor
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetVendorOrders(Guid vendorId, [FromQuery] bool includeDetails = true)
    {
        try
        {
            var orders = await _orderRepository.GetByVendorIdAsync(vendorId, includeDetails);

            return Ok(new
            {
                success = true,
                data = orders,
                count = orders.Count()
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting orders for vendor {VendorId}", vendorId);
            return StatusCode(500, new { success = false, message = "An error occurred while fetching vendor orders" });
        }
    }

    /// <summary>
    /// Get vendor orders by status
    /// </summary>
    [HttpGet("by-status/{status}")]
    public async Task<IActionResult> GetVendorOrdersByStatus(Guid vendorId, OrderStatus status)
    {
        try
        {
            var orders = await _orderRepository.GetByVendorAndStatusAsync(vendorId, status);

            return Ok(new
            {
                success = true,
                data = orders,
                count = orders.Count()
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting orders for vendor {VendorId} with status {Status}", vendorId, status);
            return StatusCode(500, new { success = false, message = "An error occurred while fetching vendor orders" });
        }
    }

    /// <summary>
    /// Get pending orders for vendor (requires action)
    /// </summary>
    [HttpGet("pending")]
    public async Task<IActionResult> GetPendingOrders(Guid vendorId)
    {
        try
        {
            var orders = await _orderRepository.GetByVendorAndStatusAsync(vendorId, OrderStatus.Pending);

            return Ok(new
            {
                success = true,
                data = orders,
                count = orders.Count(),
                message = $"{orders.Count()} pending orders require your action"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting pending orders for vendor {VendorId}", vendorId);
            return StatusCode(500, new { success = false, message = "An error occurred while fetching pending orders" });
        }
    }

    /// <summary>
    /// Get active orders for vendor (in progress)
    /// </summary>
    [HttpGet("active")]
    public async Task<IActionResult> GetActiveOrders(Guid vendorId)
    {
        try
        {
            var allOrders = await _orderRepository.GetByVendorIdAsync(vendorId, includeDetails: true);

            var activeStatuses = new[]
            {
                OrderStatus.Confirmed,
                OrderStatus.Processing,
                OrderStatus.Ready,
                OrderStatus.Dispatched
            };

            var activeOrders = allOrders.Where(o => activeStatuses.Contains(o.Status));

            return Ok(new
            {
                success = true,
                data = activeOrders,
                count = activeOrders.Count()
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting active orders for vendor {VendorId}", vendorId);
            return StatusCode(500, new { success = false, message = "An error occurred while fetching active orders" });
        }
    }

    /// <summary>
    /// Get vendor order statistics
    /// </summary>
    [HttpGet("stats")]
    public async Task<IActionResult> GetVendorOrderStats(Guid vendorId)
    {
        try
        {
            var totalOrders = await _orderRepository.GetVendorOrderCountAsync(vendorId);
            var totalRevenue = await _orderRepository.GetVendorTotalRevenueAsync(vendorId);

            var allOrders = await _orderRepository.GetByVendorIdAsync(vendorId, includeDetails: false);

            var pendingOrders = allOrders.Count(o => o.Status == OrderStatus.Pending);
            var confirmedOrders = allOrders.Count(o => o.Status == OrderStatus.Confirmed);
            var processingOrders = allOrders.Count(o => o.Status == OrderStatus.Processing);
            var dispatchedOrders = allOrders.Count(o => o.Status == OrderStatus.Dispatched);
            var completedOrders = allOrders.Count(o => o.Status == OrderStatus.Completed);
            var cancelledOrders = allOrders.Count(o => o.Status == OrderStatus.Cancelled);

            // Calculate today's orders
            var today = DateTime.UtcNow.Date;
            var todayOrders = allOrders.Count(o => o.CreatedAt.Date == today);
            var todayRevenue = allOrders
                .Where(o => o.CreatedAt.Date == today && 
                           (o.Status == OrderStatus.Completed || o.Status == OrderStatus.Delivered))
                .Sum(o => o.TotalAmount);

            // Calculate this month's orders
            var firstDayOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
            var thisMonthOrders = allOrders.Count(o => o.CreatedAt >= firstDayOfMonth);
            var thisMonthRevenue = allOrders
                .Where(o => o.CreatedAt >= firstDayOfMonth && 
                           (o.Status == OrderStatus.Completed || o.Status == OrderStatus.Delivered))
                .Sum(o => o.TotalAmount);

            return Ok(new
            {
                success = true,
                data = new
                {
                    totalOrders,
                    totalRevenue,
                    todayOrders,
                    todayRevenue,
                    thisMonthOrders,
                    thisMonthRevenue,
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
            _logger.LogError(ex, "Error getting stats for vendor {VendorId}", vendorId);
            return StatusCode(500, new { success = false, message = "An error occurred while fetching vendor statistics" });
        }
    }

    /// <summary>
    /// Accept an order (vendor action)
    /// </summary>
    [HttpPost("{orderId}/accept")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> AcceptOrder(Guid vendorId, Guid orderId)
    {
        try
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null)
                return NotFound(new { success = false, message = "Order not found" });

            if (order.VendorId != vendorId)
                return BadRequest(new { success = false, message = "Order does not belong to this vendor" });

            if (order.Status != OrderStatus.Pending)
                return BadRequest(new { success = false, message = $"Cannot accept order in status: {order.Status}" });

            // Check if offer expired
            if (order.OfferExpiresAt.HasValue && order.OfferExpiresAt.Value < DateTime.UtcNow)
                return BadRequest(new { success = false, message = "Offer has expired" });

            // Update order
            var previousStatus = order.Status;
            order.Status = OrderStatus.Confirmed;
            order.AcceptedAt = DateTime.UtcNow;
            order.RespondedAt = DateTime.UtcNow;

            await _orderRepository.UpdateAsync(order);

            // Add status history
            await _orderStatusHistoryRepository.AddAsync(new Models.Entities.OrderStatusHistory
            {
                Id = Guid.NewGuid(),
                OrderId = orderId,
                PreviousStatus = previousStatus,
                NewStatus = OrderStatus.Confirmed,
                ChangedBy = vendorId,
                ChangedByType = "Vendor",
                Reason = "Order accepted by vendor",
                ChangedAt = DateTime.UtcNow
            });

            _logger.LogInformation("Order {OrderId} accepted by vendor {VendorId}", orderId, vendorId);

            return Ok(new
            {
                success = true,
                message = "Order accepted successfully",
                data = order
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error accepting order {OrderId} for vendor {VendorId}", orderId, vendorId);
            return StatusCode(500, new { success = false, message = "An error occurred while accepting the order" });
        }
    }

    /// <summary>
    /// Reject an order (vendor action)
    /// </summary>
    [HttpPost("{orderId}/reject")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> RejectOrder(
        Guid vendorId, 
        Guid orderId,
        [FromBody] RejectOrderRequest request)
    {
        try
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null)
                return NotFound(new { success = false, message = "Order not found" });

            if (order.VendorId != vendorId)
                return BadRequest(new { success = false, message = "Order does not belong to this vendor" });

            if (order.Status != OrderStatus.Pending)
                return BadRequest(new { success = false, message = $"Cannot reject order in status: {order.Status}" });

            // Update order
            var previousStatus = order.Status;
            order.Status = OrderStatus.Rejected;
            order.RejectedAt = DateTime.UtcNow;
            order.RespondedAt = DateTime.UtcNow;
            order.RejectionReason = request.Reason;

            await _orderRepository.UpdateAsync(order);

            // Add status history
            await _orderStatusHistoryRepository.AddAsync(new Models.Entities.OrderStatusHistory
            {
                Id = Guid.NewGuid(),
                OrderId = orderId,
                PreviousStatus = previousStatus,
                NewStatus = OrderStatus.Rejected,
                ChangedBy = vendorId,
                ChangedByType = "Vendor",
                Reason = $"Order rejected: {request.Reason}",
                ChangedAt = DateTime.UtcNow
            });

            _logger.LogInformation("Order {OrderId} rejected by vendor {VendorId}. Reason: {Reason}", 
                orderId, vendorId, request.Reason);

            return Ok(new
            {
                success = true,
                message = "Order rejected successfully",
                data = order
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error rejecting order {OrderId} for vendor {VendorId}", orderId, vendorId);
            return StatusCode(500, new { success = false, message = "An error occurred while rejecting the order" });
        }
    }

    /// <summary>
    /// Mark order as ready for pickup/delivery (vendor action)
    /// </summary>
    [HttpPost("{orderId}/mark-ready")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> MarkOrderReady(Guid vendorId, Guid orderId)
    {
        try
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null)
                return NotFound(new { success = false, message = "Order not found" });

            if (order.VendorId != vendorId)
                return BadRequest(new { success = false, message = "Order does not belong to this vendor" });

            if (order.Status != OrderStatus.Processing && order.Status != OrderStatus.Confirmed)
                return BadRequest(new { success = false, message = $"Cannot mark ready in status: {order.Status}" });

            // Update order
            var previousStatus = order.Status;
            order.Status = OrderStatus.Ready;

            await _orderRepository.UpdateAsync(order);

            // Add status history
            await _orderStatusHistoryRepository.AddAsync(new Models.Entities.OrderStatusHistory
            {
                Id = Guid.NewGuid(),
                OrderId = orderId,
                PreviousStatus = previousStatus,
                NewStatus = OrderStatus.Ready,
                ChangedBy = vendorId,
                ChangedByType = "Vendor",
                Reason = "Order marked as ready by vendor",
                ChangedAt = DateTime.UtcNow
            });

            _logger.LogInformation("Order {OrderId} marked as ready by vendor {VendorId}", orderId, vendorId);

            return Ok(new
            {
                success = true,
                message = "Order marked as ready successfully",
                data = order
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking order {OrderId} as ready for vendor {VendorId}", orderId, vendorId);
            return StatusCode(500, new { success = false, message = "An error occurred while marking the order as ready" });
        }
    }

    /// <summary>
    /// Report an issue with an order (vendor action)
    /// </summary>
    [HttpPost("{orderId}/report-issue")]
    [ProducesResponseType(201)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> ReportIssue(
        Guid vendorId,
        Guid orderId,
        [FromBody] ReportIssueRequest request)
    {
        try
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null)
                return NotFound(new { success = false, message = "Order not found" });

            if (order.VendorId != vendorId)
                return BadRequest(new { success = false, message = "Order does not belong to this vendor" });

            // Create issue
            var issue = new Models.Entities.OrderIssue
            {
                Id = Guid.NewGuid(),
                OrderId = orderId,
                Description = request.Description,
                IssueType = request.IssueType,
                Status = "open",
                ReportedBy = vendorId,
                ReportedByRole = "vendor",
                Notes = request.Notes
            };

            var createdIssue = await _orderIssueRepository.CreateAsync(issue);

            _logger.LogInformation("Issue {IssueId} reported for order {OrderId} by vendor {VendorId}", 
                createdIssue.Id, orderId, vendorId);

            return Created("", new
            {
                success = true,
                message = "Issue reported successfully",
                data = createdIssue
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error reporting issue for order {OrderId} by vendor {VendorId}", orderId, vendorId);
            return StatusCode(500, new { success = false, message = "An error occurred while reporting the issue" });
        }
    }
}

// Request DTOs
public class RejectOrderRequest
{
    public string Reason { get; set; } = string.Empty;
}

public class ReportIssueRequest
{
    public string Description { get; set; } = string.Empty;
    public string IssueType { get; set; } = string.Empty;
    public string? Notes { get; set; }
}