using OrderService.Models.Enums;

namespace OrderService.Models.DTOs;

/// <summary>
/// Response DTO for order
/// </summary>
public class OrderResponse
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public Guid CustomerId { get; set; }
    public Guid VendorId { get; set; }
    public OrderType OrderType { get; set; }
    public string OrderTypeDisplay { get; set; } = string.Empty;
    public OrderStatus Status { get; set; }
    public string StatusDisplay { get; set; } = string.Empty;
    public DeliveryAddressResponse? DeliveryAddress { get; set; }
    public List<OrderItemResponse> Items { get; set; } = new();
    public List<OrderLaborResponse> LaborBookings { get; set; } = new();
    public decimal SubtotalAmount { get; set; }
    public decimal GstAmount { get; set; }
    public decimal DeliveryCharges { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal PlatformFee { get; set; }
    public decimal VendorPayoutAmount { get; set; }
    public decimal LogisticsFee { get; set; }
    public decimal Deductions { get; set; }
    
    // Denormalized buyer information
    public string BuyerName { get; set; } = string.Empty;
    public string BuyerPhone { get; set; } = string.Empty;
    public string BuyerLocation { get; set; } = string.Empty;
    
    // Denormalized vendor information
    public string VendorName { get; set; } = string.Empty;
    public string VendorType { get; set; } = string.Empty;
    public string VendorPhone { get; set; } = string.Empty;
    
    // Offer tracking
    public DateTime? OfferedAt { get; set; }
    public DateTime? OfferExpiresAt { get; set; }
    public DateTime? RespondedAt { get; set; }
    public DateTime? AcceptedAt { get; set; }
    public DateTime? RejectedAt { get; set; }
    public string? RejectionReason { get; set; }
    
    // Rating and review
    public int? Rating { get; set; }
    public string? ReviewText { get; set; }
    public DateTime? ReviewedAt { get; set; }
    
    // Settlement
    public Guid? SettlementId { get; set; }
    public DateTime? SettlementDate { get; set; }
    public string? SettlementStatus { get; set; }
    
    // Delivery time slot
    public TimeSpan? DeliverySlotStart { get; set; }
    public TimeSpan? DeliverySlotEnd { get; set; }
    public string? DeliverySlot { get; set; } // Formatted: "9:00 AM - 11:00 AM"
    
    // Dispute
    public Guid? DisputeId { get; set; }
    public bool HasActiveDispute { get; set; }
    
    public PaymentResponse? Payment { get; set; }
    public DeliveryResponse? Delivery { get; set; }
    public string? CustomerNotes { get; set; }
    public string? VendorNotes { get; set; }
    public DateTime? ExpectedDeliveryDate { get; set; }
    public DateTime? ActualDeliveryDate { get; set; }
    public string? CancellationReason { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

/// <summary>
/// Response DTO for order item
/// </summary>
public class OrderItemResponse
{
    public Guid Id { get; set; }
    public Guid MaterialId { get; set; }
    public string MaterialName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string? Sku { get; set; }
    public string Unit { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public decimal Quantity { get; set; }
    public decimal GstPercentage { get; set; }
    public decimal GstAmount { get; set; }
    public decimal TotalAmount { get; set; }
    public string? Notes { get; set; }
}

/// <summary>
/// Response DTO for labor booking
/// </summary>
public class OrderLaborResponse
{
    public Guid Id { get; set; }
    public Guid LaborCategoryId { get; set; }
    public string LaborCategoryName { get; set; } = string.Empty;
    public int SkillLevel { get; set; }
    public string SkillLevelDisplay { get; set; } = string.Empty;
    public int WorkerCount { get; set; }
    public decimal HourlyRate { get; set; }
    public decimal DailyRate { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int? HoursBooked { get; set; }
    public int? DaysBooked { get; set; }
    public decimal TotalAmount { get; set; }
    public string? Requirements { get; set; }
}

/// <summary>
/// Response DTO for delivery address
/// </summary>
public class DeliveryAddressResponse
{
    public Guid Id { get; set; }
    public string Label { get; set; } = string.Empty;
    public string ContactName { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public string AddressLine1 { get; set; } = string.Empty;
    public string? AddressLine2 { get; set; }
    public string? Landmark { get; set; }
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string FormattedAddress { get; set; } = string.Empty;
}

/// <summary>
/// Response DTO for payment
/// </summary>
public class PaymentResponse
{
    public Guid Id { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public string PaymentMethodDisplay { get; set; } = string.Empty;
    public PaymentStatus Status { get; set; }
    public string StatusDisplay { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal AmountPaid { get; set; }
    public decimal AmountRefunded { get; set; }
    public string? TransactionId { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime? PaidAt { get; set; }
}

/// <summary>
/// Response DTO for delivery
/// </summary>
public class DeliveryResponse
{
    public Guid Id { get; set; }
    public DeliveryMethod DeliveryMethod { get; set; }
    public string DeliveryMethodDisplay { get; set; } = string.Empty;
    public string? TrackingNumber { get; set; }
    public string? DeliveryPartner { get; set; }
    public string? DriverName { get; set; }
    public string? DriverPhone { get; set; }
    public DateTime? ScheduledDate { get; set; }
    public DateTime? DispatchedAt { get; set; }
    public DateTime? DeliveredAt { get; set; }
}

/// <summary>
/// Response DTO for order status history
/// </summary>
public class OrderStatusHistoryResponse
{
    public Guid Id { get; set; }
    public OrderStatus? PreviousStatus { get; set; }
    public string? PreviousStatusDisplay { get; set; }
    public OrderStatus NewStatus { get; set; }
    public string NewStatusDisplay { get; set; } = string.Empty;
    public Guid ChangedBy { get; set; }
    public string ChangedByType { get; set; } = string.Empty;
    public string? Reason { get; set; }
    public string? Notes { get; set; }
    public DateTime ChangedAt { get; set; }
}