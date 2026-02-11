namespace OrderService.Models.Enums;

/// <summary>
/// Priority level of a dispute
/// </summary>
public enum DisputePriority
{
    /// <summary>
    /// Low priority
    /// </summary>
    Low = 1,
    
    /// <summary>
    /// Medium priority
    /// </summary>
    Medium = 2,
    
    /// <summary>
    /// High priority
    /// </summary>
    High = 3,
    
    /// <summary>
    /// Critical priority (requires immediate attention)
    /// </summary>
    Critical = 4
}
