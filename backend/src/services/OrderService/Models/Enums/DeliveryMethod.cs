namespace OrderService.Models.Enums;

/// <summary>
/// Delivery method enumeration
/// </summary>
public enum DeliveryMethod
{
    /// <summary>
    /// Standard home delivery
    /// </summary>
    HomeDelivery = 1,
    
    /// <summary>
    /// Customer pickup from vendor location
    /// </summary>
    SelfPickup = 2,
    
    /// <summary>
    /// Express/same-day delivery
    /// </summary>
    ExpressDelivery = 3,
    
    /// <summary>
    /// Scheduled delivery at specific time
    /// </summary>
    ScheduledDelivery = 4
}
