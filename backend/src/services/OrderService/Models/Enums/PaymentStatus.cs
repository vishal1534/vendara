namespace OrderService.Models.Enums;

/// <summary>
/// Payment status enumeration
/// </summary>
public enum PaymentStatus
{
    /// <summary>
    /// Payment pending
    /// </summary>
    Pending = 1,
    
    /// <summary>
    /// Payment authorized but not captured
    /// </summary>
    Authorized = 2,
    
    /// <summary>
    /// Payment successful
    /// </summary>
    Paid = 3,
    
    /// <summary>
    /// Payment failed
    /// </summary>
    Failed = 4,
    
    /// <summary>
    /// Payment refunded
    /// </summary>
    Refunded = 5,
    
    /// <summary>
    /// Payment partially refunded
    /// </summary>
    PartiallyRefunded = 6,
    
    /// <summary>
    /// Payment cancelled
    /// </summary>
    Cancelled = 7
}
