using OrderService.Models.Enums;

namespace OrderService.Models.Entities;

/// <summary>
/// Order status history entity for audit trail
/// </summary>
public class OrderStatusHistory
{
    /// <summary>
    /// Unique history record identifier
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
    /// Previous status
    /// </summary>
    public OrderStatus? PreviousStatus { get; set; }
    
    /// <summary>
    /// New status
    /// </summary>
    public OrderStatus NewStatus { get; set; }
    
    /// <summary>
    /// User who changed the status
    /// </summary>
    public Guid ChangedBy { get; set; }
    
    /// <summary>
    /// User type (Customer, Vendor, System)
    /// </summary>
    public string ChangedByType { get; set; } = string.Empty;
    
    /// <summary>
    /// Reason for status change
    /// </summary>
    public string? Reason { get; set; }
    
    /// <summary>
    /// Additional notes
    /// </summary>
    public string? Notes { get; set; }
    
    /// <summary>
    /// Status change timestamp
    /// </summary>
    public DateTime ChangedAt { get; set; }
}
