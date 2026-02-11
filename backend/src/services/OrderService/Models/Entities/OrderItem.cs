namespace OrderService.Models.Entities;

/// <summary>
/// Order item entity representing a material item in an order
/// </summary>
public class OrderItem
{
    /// <summary>
    /// Unique order item identifier
    /// </summary>
    public Guid Id { get; set; }
    
    /// <summary>
    /// Parent order ID
    /// </summary>
    public Guid OrderId { get; set; }
    
    /// <summary>
    /// Parent order reference
    /// </summary>
    public Order Order { get; set; } = null!;
    
    /// <summary>
    /// Material ID from Catalog Service
    /// </summary>
    public Guid MaterialId { get; set; }
    
    /// <summary>
    /// Vendor inventory ID (specific vendor's offering)
    /// </summary>
    public Guid VendorInventoryId { get; set; }
    
    /// <summary>
    /// Material name (snapshot at order time)
    /// </summary>
    public string MaterialName { get; set; } = string.Empty;
    
    /// <summary>
    /// Material category (cement, sand, steel, etc.)
    /// </summary>
    public string Category { get; set; } = string.Empty;
    
    /// <summary>
    /// Material SKU
    /// </summary>
    public string? Sku { get; set; }
    
    /// <summary>
    /// Unit of measurement (bag, kg, cft, piece, etc.)
    /// </summary>
    public string Unit { get; set; } = string.Empty;
    
    /// <summary>
    /// Unit price at order time
    /// </summary>
    public decimal UnitPrice { get; set; }
    
    /// <summary>
    /// Quantity ordered
    /// </summary>
    public decimal Quantity { get; set; }
    
    /// <summary>
    /// GST percentage applicable
    /// </summary>
    public decimal GstPercentage { get; set; }
    
    /// <summary>
    /// GST amount for this item
    /// </summary>
    public decimal GstAmount { get; set; }
    
    /// <summary>
    /// Total amount (quantity * unit price)
    /// </summary>
    public decimal TotalAmount { get; set; }
    
    /// <summary>
    /// Item notes/specifications
    /// </summary>
    public string? Notes { get; set; }
    
    /// <summary>
    /// Item created timestamp
    /// </summary>
    public DateTime CreatedAt { get; set; }
}