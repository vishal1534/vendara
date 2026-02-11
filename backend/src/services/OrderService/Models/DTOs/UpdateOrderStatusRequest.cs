using OrderService.Models.Enums;

namespace OrderService.Models.DTOs;

/// <summary>
/// Request DTO for updating order status
/// </summary>
public class UpdateOrderStatusRequest
{
    /// <summary>
    /// New status
    /// </summary>
    public OrderStatus Status { get; set; }
    
    /// <summary>
    /// Reason for status change
    /// </summary>
    public string? Reason { get; set; }
    
    /// <summary>
    /// Additional notes
    /// </summary>
    public string? Notes { get; set; }
    
    /// <summary>
    /// User making the change
    /// </summary>
    public Guid ChangedBy { get; set; }
    
    /// <summary>
    /// User type (Customer, Vendor, System)
    /// </summary>
    public string ChangedByType { get; set; } = string.Empty;
}

/// <summary>
/// Request DTO for creating/updating delivery address
/// </summary>
public class CreateDeliveryAddressRequest
{
    public Guid CustomerId { get; set; }
    public string Label { get; set; } = string.Empty;
    public string ContactName { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public string AddressLine1 { get; set; } = string.Empty;
    public string? AddressLine2 { get; set; }
    public string? Landmark { get; set; }
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public bool IsDefault { get; set; }
}

/// <summary>
/// Request DTO for updating delivery information
/// </summary>
public class UpdateDeliveryRequest
{
    public string? TrackingNumber { get; set; }
    public string? DeliveryPartner { get; set; }
    public string? DriverName { get; set; }
    public string? DriverPhone { get; set; }
    public string? VehicleNumber { get; set; }
    public DateTime? ScheduledDate { get; set; }
    public string? Instructions { get; set; }
    public string? Notes { get; set; }
}

/// <summary>
/// Request DTO for updating payment information
/// </summary>
public class UpdatePaymentRequest
{
    public PaymentStatus Status { get; set; }
    public string? TransactionId { get; set; }
    public string? GatewayReference { get; set; }
    public decimal? AmountPaid { get; set; }
    public string? Notes { get; set; }
}
