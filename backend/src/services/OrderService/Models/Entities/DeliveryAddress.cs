namespace OrderService.Models.Entities;

/// <summary>
/// Delivery address entity for order delivery
/// </summary>
public class DeliveryAddress
{
    /// <summary>
    /// Unique address identifier
    /// </summary>
    public Guid Id { get; set; }
    
    /// <summary>
    /// Customer user ID
    /// </summary>
    public Guid CustomerId { get; set; }
    
    /// <summary>
    /// Address label (Home, Site, Office, etc.)
    /// </summary>
    public string Label { get; set; } = string.Empty;
    
    /// <summary>
    /// Contact person name
    /// </summary>
    public string ContactName { get; set; } = string.Empty;
    
    /// <summary>
    /// Contact phone number
    /// </summary>
    public string ContactPhone { get; set; } = string.Empty;
    
    /// <summary>
    /// Building/house number and name
    /// </summary>
    public string AddressLine1 { get; set; } = string.Empty;
    
    /// <summary>
    /// Street/area details
    /// </summary>
    public string? AddressLine2 { get; set; }
    
    /// <summary>
    /// Landmark for easy location
    /// </summary>
    public string? Landmark { get; set; }
    
    /// <summary>
    /// City
    /// </summary>
    public string City { get; set; } = string.Empty;
    
    /// <summary>
    /// State
    /// </summary>
    public string State { get; set; } = string.Empty;
    
    /// <summary>
    /// Postal code
    /// </summary>
    public string PostalCode { get; set; } = string.Empty;
    
    /// <summary>
    /// Country
    /// </summary>
    public string Country { get; set; } = "India";
    
    /// <summary>
    /// Latitude coordinate
    /// </summary>
    public double? Latitude { get; set; }
    
    /// <summary>
    /// Longitude coordinate
    /// </summary>
    public double? Longitude { get; set; }
    
    /// <summary>
    /// Is this the default delivery address
    /// </summary>
    public bool IsDefault { get; set; }
    
    /// <summary>
    /// Is address active
    /// </summary>
    public bool IsActive { get; set; } = true;
    
    /// <summary>
    /// Address created timestamp
    /// </summary>
    public DateTime CreatedAt { get; set; }
    
    /// <summary>
    /// Address last updated timestamp
    /// </summary>
    public DateTime UpdatedAt { get; set; }
}
