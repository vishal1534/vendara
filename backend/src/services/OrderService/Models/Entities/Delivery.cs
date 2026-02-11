using OrderService.Models.Enums;

namespace OrderService.Models.Entities;

/// <summary>
/// Delivery entity for order delivery tracking
/// </summary>
public class Delivery
{
    /// <summary>
    /// Unique delivery identifier
    /// </summary>
    public Guid Id { get; set; }
    
    /// <summary>
    /// Order ID
    /// </summary>
    public Guid OrderId { get; set; }
    
    /// <summary>
    /// Order reference
    /// </summary>
    public Order Order { get; set; } = null!;
    
    /// <summary>
    /// Delivery method
    /// </summary>
    public DeliveryMethod DeliveryMethod { get; set; }
    
    /// <summary>
    /// Delivery tracking number
    /// </summary>
    public string? TrackingNumber { get; set; }
    
    /// <summary>
    /// Delivery partner name
    /// </summary>
    public string? DeliveryPartner { get; set; }
    
    /// <summary>
    /// Driver/delivery person name
    /// </summary>
    public string? DriverName { get; set; }
    
    /// <summary>
    /// Driver contact number
    /// </summary>
    public string? DriverPhone { get; set; }
    
    /// <summary>
    /// Vehicle number
    /// </summary>
    public string? VehicleNumber { get; set; }
    
    /// <summary>
    /// Scheduled delivery date
    /// </summary>
    public DateTime? ScheduledDate { get; set; }
    
    /// <summary>
    /// Dispatched date/time
    /// </summary>
    public DateTime? DispatchedAt { get; set; }
    
    /// <summary>
    /// Delivered date/time
    /// </summary>
    public DateTime? DeliveredAt { get; set; }
    
    /// <summary>
    /// Delivery instructions
    /// </summary>
    public string? Instructions { get; set; }
    
    /// <summary>
    /// Delivery notes/remarks
    /// </summary>
    public string? Notes { get; set; }
    
    /// <summary>
    /// Delivery created timestamp
    /// </summary>
    public DateTime CreatedAt { get; set; }
    
    /// <summary>
    /// Delivery last updated timestamp
    /// </summary>
    public DateTime UpdatedAt { get; set; }
}
