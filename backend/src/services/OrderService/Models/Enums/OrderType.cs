namespace OrderService.Models.Enums;

/// <summary>
/// Order type enumeration
/// </summary>
public enum OrderType
{
    /// <summary>
    /// Material order only
    /// </summary>
    Material = 1,
    
    /// <summary>
    /// Labor booking only
    /// </summary>
    Labor = 2,
    
    /// <summary>
    /// Combined material and labor order
    /// </summary>
    Combined = 3
}
