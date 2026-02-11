using OrderService.Models.Enums;

namespace OrderService.Models.DTOs;

/// <summary>
/// Request DTO for creating a new order
/// </summary>
public class CreateOrderRequest
{
    /// <summary>
    /// Customer ID
    /// </summary>
    public Guid CustomerId { get; set; }
    
    /// <summary>
    /// Vendor ID
    /// </summary>
    public Guid VendorId { get; set; }
    
    /// <summary>
    /// Order type
    /// </summary>
    public OrderType OrderType { get; set; }
    
    /// <summary>
    /// Delivery address ID
    /// </summary>
    public Guid? DeliveryAddressId { get; set; }
    
    /// <summary>
    /// Material order items
    /// </summary>
    public List<CreateOrderItemRequest>? Items { get; set; }
    
    /// <summary>
    /// Labor bookings
    /// </summary>
    public List<CreateOrderLaborRequest>? LaborBookings { get; set; }
    
    /// <summary>
    /// Payment method
    /// </summary>
    public PaymentMethod PaymentMethod { get; set; }
    
    /// <summary>
    /// Delivery method
    /// </summary>
    public DeliveryMethod DeliveryMethod { get; set; }
    
    /// <summary>
    /// Expected delivery date
    /// </summary>
    public DateTime? ExpectedDeliveryDate { get; set; }
    
    /// <summary>
    /// Customer notes
    /// </summary>
    public string? CustomerNotes { get; set; }
}

/// <summary>
/// Request DTO for order item
/// </summary>
public class CreateOrderItemRequest
{
    /// <summary>
    /// Material ID
    /// </summary>
    public Guid MaterialId { get; set; }
    
    /// <summary>
    /// Vendor inventory ID
    /// </summary>
    public Guid VendorInventoryId { get; set; }
    
    /// <summary>
    /// Quantity
    /// </summary>
    public decimal Quantity { get; set; }
    
    /// <summary>
    /// Item notes
    /// </summary>
    public string? Notes { get; set; }
}

/// <summary>
/// Request DTO for labor booking
/// </summary>
public class CreateOrderLaborRequest
{
    /// <summary>
    /// Labor category ID
    /// </summary>
    public Guid LaborCategoryId { get; set; }
    
    /// <summary>
    /// Vendor labor availability ID
    /// </summary>
    public Guid VendorLaborAvailabilityId { get; set; }
    
    /// <summary>
    /// Number of workers
    /// </summary>
    public int WorkerCount { get; set; }
    
    /// <summary>
    /// Start date
    /// </summary>
    public DateTime StartDate { get; set; }
    
    /// <summary>
    /// End date
    /// </summary>
    public DateTime EndDate { get; set; }
    
    /// <summary>
    /// Hours booked (for hourly)
    /// </summary>
    public int? HoursBooked { get; set; }
    
    /// <summary>
    /// Days booked (for daily)
    /// </summary>
    public int? DaysBooked { get; set; }
    
    /// <summary>
    /// Requirements/notes
    /// </summary>
    public string? Requirements { get; set; }
}
