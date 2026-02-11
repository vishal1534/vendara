namespace OrderService.Models.Enums;

/// <summary>
/// Order status enumeration for tracking order lifecycle
/// </summary>
public enum OrderStatus
{
    /// <summary>
    /// Order draft, not yet submitted
    /// </summary>
    Draft = 1,
    
    /// <summary>
    /// Order submitted, pending vendor acceptance
    /// </summary>
    Pending = 2,
    
    /// <summary>
    /// Order confirmed by vendor
    /// </summary>
    Confirmed = 3,
    
    /// <summary>
    /// Order is being processed/prepared
    /// </summary>
    Processing = 4,
    
    /// <summary>
    /// Order ready for dispatch/pickup
    /// </summary>
    Ready = 5,
    
    /// <summary>
    /// Order dispatched/in transit
    /// </summary>
    Dispatched = 6,
    
    /// <summary>
    /// Order delivered to customer
    /// </summary>
    Delivered = 7,
    
    /// <summary>
    /// Order completed and closed
    /// </summary>
    Completed = 8,
    
    /// <summary>
    /// Order cancelled by customer or vendor
    /// </summary>
    Cancelled = 9,
    
    /// <summary>
    /// Order rejected by vendor
    /// </summary>
    Rejected = 10,
    
    /// <summary>
    /// Order refunded
    /// </summary>
    Refunded = 11
}
