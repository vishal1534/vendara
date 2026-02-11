namespace OrderService.Models.Enums;

/// <summary>
/// Reasons for order disputes
/// </summary>
public enum DisputeReason
{
    /// <summary>
    /// Wrong items delivered
    /// </summary>
    WrongItems = 1,
    
    /// <summary>
    /// Items delivered were damaged
    /// </summary>
    DamagedItems = 2,
    
    /// <summary>
    /// Some items missing from order
    /// </summary>
    MissingItems = 3,
    
    /// <summary>
    /// Quality of items not as expected
    /// </summary>
    QualityIssue = 4,
    
    /// <summary>
    /// Quantity mismatch (less or more than ordered)
    /// </summary>
    QuantityMismatch = 5,
    
    /// <summary>
    /// Delivery was late
    /// </summary>
    LateDelivery = 6,
    
    /// <summary>
    /// Pricing was incorrect
    /// </summary>
    WrongPricing = 7,
    
    /// <summary>
    /// Vendor/labor did not show up
    /// </summary>
    VendorNoShow = 8,
    
    /// <summary>
    /// Work was incomplete or substandard
    /// </summary>
    IncompleteWork = 9,
    
    /// <summary>
    /// Other reason
    /// </summary>
    Other = 10
}
