using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using OrderService.Models.DTOs;
using OrderService.Models.Entities;
using OrderService.Models.Enums;
using OrderService.Models.Authorization;
using OrderService.Repositories;

namespace OrderService.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize] // All endpoints require authentication by default
public class OrdersController : ControllerBase
{
    private readonly IOrderRepository _orderRepository;
    private readonly IOrderStatusHistoryRepository _statusHistoryRepository;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(
        IOrderRepository orderRepository,
        IOrderStatusHistoryRepository statusHistoryRepository,
        ILogger<OrdersController> logger)
    {
        _orderRepository = orderRepository;
        _statusHistoryRepository = statusHistoryRepository;
        _logger = logger;
    }

    /// <summary>
    /// Get all orders (Admin only)
    /// </summary>
    [HttpGet]
    [Authorize(Policy = AuthorizationPolicies.AdminOnly)]
    public async Task<IActionResult> GetOrders([FromQuery] bool includeDetails = false)
    {
        try
        {
            var orders = await _orderRepository.GetAllAsync(includeDetails);
            var response = orders.Select(MapToOrderResponse);

            return Ok(new
            {
                success = true,
                data = response,
                count = response.Count()
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting orders");
            return StatusCode(500, new { success = false, message = "An error occurred while fetching orders" });
        }
    }

    /// <summary>
    /// Get order by ID (Admin, Customer owns order, or Vendor owns order)
    /// </summary>
    [HttpGet("{id}")]
    [Authorize(Policy = AuthorizationPolicies.AnyAuthenticated)]
    public async Task<IActionResult> GetOrder(Guid id)
    {
        try
        {
            var order = await _orderRepository.GetByIdAsync(id, includeDetails: true);

            if (order == null)
            {
                return NotFound(new { success = false, message = "Order not found" });
            }

            return Ok(new
            {
                success = true,
                data = MapToOrderResponse(order)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting order {OrderId}", id);
            return StatusCode(500, new { success = false, message = "An error occurred while fetching the order" });
        }
    }

    /// <summary>
    /// Get order by order number (Admin, Customer owns order, or Vendor owns order)
    /// </summary>
    [HttpGet("by-number/{orderNumber}")]
    [Authorize(Policy = AuthorizationPolicies.AnyAuthenticated)]
    public async Task<IActionResult> GetOrderByNumber(string orderNumber)
    {
        try
        {
            var order = await _orderRepository.GetByOrderNumberAsync(orderNumber, includeDetails: true);

            if (order == null)
            {
                return NotFound(new { success = false, message = "Order not found" });
            }

            return Ok(new
            {
                success = true,
                data = MapToOrderResponse(order)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting order {OrderNumber}", orderNumber);
            return StatusCode(500, new { success = false, message = "An error occurred while fetching the order" });
        }
    }

    /// <summary>
    /// Create new order (Customers can create orders)
    /// </summary>
    [HttpPost]
    [Authorize(Policy = AuthorizationPolicies.AnyAuthenticated)]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
    {
        try
        {
            // Generate order number
            var orderNumber = await _orderRepository.GenerateOrderNumberAsync();

            // Calculate amounts
            decimal subtotal = 0;
            decimal gstAmount = 0;

            var order = new Order
            {
                Id = Guid.NewGuid(),
                OrderNumber = orderNumber,
                CustomerId = request.CustomerId,
                VendorId = request.VendorId,
                OrderType = request.OrderType,
                Status = OrderStatus.Pending,
                DeliveryAddressId = request.DeliveryAddressId,
                CustomerNotes = request.CustomerNotes,
                ExpectedDeliveryDate = request.ExpectedDeliveryDate,
                OrderItems = new List<OrderItem>(),
                LaborBookings = new List<OrderLabor>()
            };

            // Add order items
            if (request.Items != null && request.Items.Any())
            {
                foreach (var itemReq in request.Items)
                {
                    // In production, fetch material details from Catalog Service
                    var item = new OrderItem
                    {
                        Id = Guid.NewGuid(),
                        OrderId = order.Id,
                        MaterialId = itemReq.MaterialId,
                        VendorInventoryId = itemReq.VendorInventoryId,
                        MaterialName = "Material Name", // TODO: Fetch from Catalog Service
                        Unit = "unit", // TODO: Fetch from Catalog Service
                        UnitPrice = 100, // TODO: Fetch from Catalog Service
                        Quantity = itemReq.Quantity,
                        GstPercentage = 18, // TODO: Fetch from Catalog Service
                        Notes = itemReq.Notes,
                        CreatedAt = DateTime.UtcNow
                    };

                    item.TotalAmount = item.UnitPrice * item.Quantity;
                    item.GstAmount = item.TotalAmount * (item.GstPercentage / 100);

                    subtotal += item.TotalAmount;
                    gstAmount += item.GstAmount;

                    order.OrderItems.Add(item);
                }
            }

            // Add labor bookings
            if (request.LaborBookings != null && request.LaborBookings.Any())
            {
                foreach (var laborReq in request.LaborBookings)
                {
                    // In production, fetch labor details from Catalog Service
                    var labor = new OrderLabor
                    {
                        Id = Guid.NewGuid(),
                        OrderId = order.Id,
                        LaborCategoryId = laborReq.LaborCategoryId,
                        VendorLaborAvailabilityId = laborReq.VendorLaborAvailabilityId,
                        LaborCategoryName = "Labor Category", // TODO: Fetch from Catalog Service
                        SkillLevel = 2,
                        WorkerCount = laborReq.WorkerCount,
                        HourlyRate = 75, // TODO: Fetch from Catalog Service
                        DailyRate = 600, // TODO: Fetch from Catalog Service
                        StartDate = laborReq.StartDate,
                        EndDate = laborReq.EndDate,
                        HoursBooked = laborReq.HoursBooked,
                        DaysBooked = laborReq.DaysBooked,
                        Requirements = laborReq.Requirements,
                        CreatedAt = DateTime.UtcNow
                    };

                    if (laborReq.DaysBooked.HasValue)
                    {
                        labor.TotalAmount = labor.DailyRate * laborReq.DaysBooked.Value * laborReq.WorkerCount;
                    }
                    else if (laborReq.HoursBooked.HasValue)
                    {
                        labor.TotalAmount = labor.HourlyRate * laborReq.HoursBooked.Value * laborReq.WorkerCount;
                    }

                    subtotal += labor.TotalAmount;

                    order.LaborBookings.Add(labor);
                }
            }

            // Calculate totals
            order.SubtotalAmount = subtotal;
            order.GstAmount = gstAmount;
            order.DeliveryCharges = 0; // TODO: Calculate based on delivery method
            order.DiscountAmount = 0;
            order.TotalAmount = subtotal + gstAmount + order.DeliveryCharges - order.DiscountAmount;

            // Create payment record
            order.Payment = new Payment
            {
                Id = Guid.NewGuid(),
                OrderId = order.Id,
                PaymentMethod = request.PaymentMethod,
                Status = PaymentStatus.Pending,
                Amount = order.TotalAmount,
                AmountPaid = 0,
                AmountRefunded = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Create delivery record
            order.Delivery = new Delivery
            {
                Id = Guid.NewGuid(),
                OrderId = order.Id,
                DeliveryMethod = request.DeliveryMethod,
                ScheduledDate = request.ExpectedDeliveryDate,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Save order
            var createdOrder = await _orderRepository.CreateAsync(order);

            // Create status history
            await _statusHistoryRepository.CreateAsync(new OrderStatusHistory
            {
                Id = Guid.NewGuid(),
                OrderId = createdOrder.Id,
                PreviousStatus = null,
                NewStatus = OrderStatus.Pending,
                ChangedBy = request.CustomerId,
                ChangedByType = "Customer",
                Reason = "Order created"
            });

            _logger.LogInformation("Order {OrderNumber} created successfully", orderNumber);

            return CreatedAtAction(nameof(GetOrder), new { id = createdOrder.Id }, new
            {
                success = true,
                message = "Order created successfully",
                data = MapToOrderResponse(createdOrder)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating order");
            return StatusCode(500, new { success = false, message = "An error occurred while creating the order" });
        }
    }

    /// <summary>
    /// Update order status (Vendor or Admin)
    /// </summary>
    [HttpPatch("{id}/status")]
    [Authorize(Policy = AuthorizationPolicies.VendorOrAdmin)]
    public async Task<IActionResult> UpdateOrderStatus(Guid id, [FromBody] UpdateOrderStatusRequest request)
    {
        try
        {
            var order = await _orderRepository.GetByIdAsync(id, includeDetails: true);

            if (order == null)
            {
                return NotFound(new { success = false, message = "Order not found" });
            }

            var previousStatus = order.Status;
            order.Status = request.Status;

            // Update timestamps based on status
            if (request.Status == OrderStatus.Dispatched && order.Delivery != null)
            {
                order.Delivery.DispatchedAt = DateTime.UtcNow;
            }
            else if (request.Status == OrderStatus.Delivered)
            {
                order.ActualDeliveryDate = DateTime.UtcNow;
                if (order.Delivery != null)
                {
                    order.Delivery.DeliveredAt = DateTime.UtcNow;
                }
            }
            else if (request.Status == OrderStatus.Cancelled)
            {
                order.CancellationReason = request.Reason;
            }

            await _orderRepository.UpdateAsync(order);

            // Create status history
            await _statusHistoryRepository.CreateAsync(new OrderStatusHistory
            {
                Id = Guid.NewGuid(),
                OrderId = order.Id,
                PreviousStatus = previousStatus,
                NewStatus = request.Status,
                ChangedBy = request.ChangedBy,
                ChangedByType = request.ChangedByType,
                Reason = request.Reason,
                Notes = request.Notes
            });

            _logger.LogInformation("Order {OrderId} status updated from {PreviousStatus} to {NewStatus}", 
                id, previousStatus, request.Status);

            return Ok(new
            {
                success = true,
                message = "Order status updated successfully",
                data = MapToOrderResponse(order)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating order status {OrderId}", id);
            return StatusCode(500, new { success = false, message = "An error occurred while updating order status" });
        }
    }

    /// <summary>
    /// Cancel order (Customer owns order, Vendor owns order, or Admin)
    /// </summary>
    [HttpPost("{id}/cancel")]
    [Authorize(Policy = AuthorizationPolicies.AnyAuthenticated)]
    public async Task<IActionResult> CancelOrder(Guid id, [FromBody] UpdateOrderStatusRequest request)
    {
        request.Status = OrderStatus.Cancelled;
        return await UpdateOrderStatus(id, request);
    }

    /// <summary>
    /// Get order status history (Any authenticated user who has access to the order)
    /// </summary>
    [HttpGet("{id}/history")]
    [Authorize(Policy = AuthorizationPolicies.AnyAuthenticated)]
    public async Task<IActionResult> GetOrderHistory(Guid id)
    {
        try
        {
            var order = await _orderRepository.GetByIdAsync(id);

            if (order == null)
            {
                return NotFound(new { success = false, message = "Order not found" });
            }

            var history = await _statusHistoryRepository.GetByOrderIdAsync(id);

            return Ok(new
            {
                success = true,
                data = history.Select(h => new OrderStatusHistoryResponse
                {
                    Id = h.Id,
                    PreviousStatus = h.PreviousStatus,
                    PreviousStatusDisplay = h.PreviousStatus?.ToString(),
                    NewStatus = h.NewStatus,
                    NewStatusDisplay = h.NewStatus.ToString(),
                    ChangedBy = h.ChangedBy,
                    ChangedByType = h.ChangedByType,
                    Reason = h.Reason,
                    Notes = h.Notes,
                    ChangedAt = h.ChangedAt
                })
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting order history {OrderId}", id);
            return StatusCode(500, new { success = false, message = "An error occurred while fetching order history" });
        }
    }

    // Helper method to map Order entity to OrderResponse DTO
    private OrderResponse MapToOrderResponse(Order order)
    {
        return new OrderResponse
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            CustomerId = order.CustomerId,
            VendorId = order.VendorId,
            OrderType = order.OrderType,
            OrderTypeDisplay = order.OrderType.ToString(),
            Status = order.Status,
            StatusDisplay = order.Status.ToString(),
            DeliveryAddress = order.DeliveryAddress != null ? new DeliveryAddressResponse
            {
                Id = order.DeliveryAddress.Id,
                Label = order.DeliveryAddress.Label,
                ContactName = order.DeliveryAddress.ContactName,
                ContactPhone = order.DeliveryAddress.ContactPhone,
                AddressLine1 = order.DeliveryAddress.AddressLine1,
                AddressLine2 = order.DeliveryAddress.AddressLine2,
                Landmark = order.DeliveryAddress.Landmark,
                City = order.DeliveryAddress.City,
                State = order.DeliveryAddress.State,
                PostalCode = order.DeliveryAddress.PostalCode,
                FormattedAddress = $"{order.DeliveryAddress.AddressLine1}, {order.DeliveryAddress.City}, {order.DeliveryAddress.State} - {order.DeliveryAddress.PostalCode}"
            } : null,
            Items = order.OrderItems.Select(i => new OrderItemResponse
            {
                Id = i.Id,
                MaterialId = i.MaterialId,
                MaterialName = i.MaterialName,
                Sku = i.Sku,
                Unit = i.Unit,
                UnitPrice = i.UnitPrice,
                Quantity = i.Quantity,
                GstPercentage = i.GstPercentage,
                GstAmount = i.GstAmount,
                TotalAmount = i.TotalAmount,
                Notes = i.Notes
            }).ToList(),
            LaborBookings = order.LaborBookings.Select(l => new OrderLaborResponse
            {
                Id = l.Id,
                LaborCategoryId = l.LaborCategoryId,
                LaborCategoryName = l.LaborCategoryName,
                SkillLevel = l.SkillLevel,
                SkillLevelDisplay = l.SkillLevel == 1 ? "Helper" : l.SkillLevel == 2 ? "Skilled" : "Expert",
                WorkerCount = l.WorkerCount,
                HourlyRate = l.HourlyRate,
                DailyRate = l.DailyRate,
                StartDate = l.StartDate,
                EndDate = l.EndDate,
                HoursBooked = l.HoursBooked,
                DaysBooked = l.DaysBooked,
                TotalAmount = l.TotalAmount,
                Requirements = l.Requirements
            }).ToList(),
            SubtotalAmount = order.SubtotalAmount,
            GstAmount = order.GstAmount,
            DeliveryCharges = order.DeliveryCharges,
            DiscountAmount = order.DiscountAmount,
            TotalAmount = order.TotalAmount,
            Payment = order.Payment != null ? new PaymentResponse
            {
                Id = order.Payment.Id,
                PaymentMethod = order.Payment.PaymentMethod,
                PaymentMethodDisplay = order.Payment.PaymentMethod.ToString(),
                Status = order.Payment.Status,
                StatusDisplay = order.Payment.Status.ToString(),
                Amount = order.Payment.Amount,
                AmountPaid = order.Payment.AmountPaid,
                AmountRefunded = order.Payment.AmountRefunded,
                TransactionId = order.Payment.TransactionId,
                DueDate = order.Payment.DueDate,
                PaidAt = order.Payment.PaidAt
            } : null,
            Delivery = order.Delivery != null ? new DeliveryResponse
            {
                Id = order.Delivery.Id,
                DeliveryMethod = order.Delivery.DeliveryMethod,
                DeliveryMethodDisplay = order.Delivery.DeliveryMethod.ToString(),
                TrackingNumber = order.Delivery.TrackingNumber,
                DeliveryPartner = order.Delivery.DeliveryPartner,
                DriverName = order.Delivery.DriverName,
                DriverPhone = order.Delivery.DriverPhone,
                ScheduledDate = order.Delivery.ScheduledDate,
                DispatchedAt = order.Delivery.DispatchedAt,
                DeliveredAt = order.Delivery.DeliveredAt
            } : null,
            CustomerNotes = order.CustomerNotes,
            VendorNotes = order.VendorNotes,
            ExpectedDeliveryDate = order.ExpectedDeliveryDate,
            ActualDeliveryDate = order.ActualDeliveryDate,
            CancellationReason = order.CancellationReason,
            CreatedAt = order.CreatedAt,
            UpdatedAt = order.UpdatedAt
        };
    }
}