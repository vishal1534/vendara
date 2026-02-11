using OrderService.Models.Enums;

namespace OrderService.Models.Entities;

/// <summary>
/// Order entity representing a customer order for materials and/or labor
/// </summary>
public class Order
{
    /// <summary>
    /// Unique order identifier
    /// </summary>
    public Guid Id { get; set; }
    
    /// <summary>
    /// Human-readable order number (e.g., ORD-2026-00001)
    /// </summary>
    public string OrderNumber { get; set; } = string.Empty;
    
    /// <summary>
    /// Customer user ID from Identity Service
    /// </summary>
    public Guid CustomerId { get; set; }
    
    /// <summary>
    /// Vendor user ID from Identity Service
    /// </summary>
    public Guid VendorId { get; set; }
    
    /// <summary>
    /// Order type (Material, Labor, Combined)
    /// </summary>
    public OrderType OrderType { get; set; }
    
    /// <summary>
    /// Current order status
    /// </summary>
    public OrderStatus Status { get; set; }
    
    /// <summary>
    /// Delivery address ID
    /// </summary>
    public Guid? DeliveryAddressId { get; set; }
    
    /// <summary>
    /// Delivery address reference
    /// </summary>
    public DeliveryAddress? DeliveryAddress { get; set; }
    
    /// <summary>
    /// Order items (materials)
    /// </summary>
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    
    /// <summary>
    /// Labor bookings
    /// </summary>
    public ICollection<OrderLabor> LaborBookings { get; set; } = new List<OrderLabor>();
    
    /// <summary>
    /// Subtotal amount (before GST and delivery)
    /// </summary>
    public decimal SubtotalAmount { get; set; }
    
    /// <summary>
    /// Total GST amount
    /// </summary>
    public decimal GstAmount { get; set; }
    
    /// <summary>
    /// Delivery charges
    /// </summary>
    public decimal DeliveryCharges { get; set; }
    
    /// <summary>
    /// Discount amount
    /// </summary>
    public decimal DiscountAmount { get; set; }
    
    /// <summary>
    /// Total amount (subtotal + GST + delivery - discount)
    /// </summary>
    public decimal TotalAmount { get; set; }
    
    /// <summary>
    /// Platform fee charged by RealServ (percentage of subtotal)
    /// </summary>
    public decimal PlatformFee { get; set; }
    
    /// <summary>
    /// Amount to be paid to vendor (subtotal - platform fee - logistics fee)
    /// </summary>
    public decimal VendorPayoutAmount { get; set; }
    
    /// <summary>
    /// Logistics/delivery fee (if applicable)
    /// </summary>
    public decimal LogisticsFee { get; set; }
    
    /// <summary>
    /// Any deductions from vendor payout (penalties, refunds, etc.)
    /// </summary>
    public decimal Deductions { get; set; }
    
    // Denormalized buyer information (for quick access)
    
    /// <summary>
    /// Buyer/Customer name (denormalized from Identity Service)
    /// </summary>
    public string BuyerName { get; set; } = string.Empty;
    
    /// <summary>
    /// Buyer phone number (denormalized)
    /// </summary>
    public string BuyerPhone { get; set; } = string.Empty;
    
    /// <summary>
    /// Buyer location/area (denormalized)
    /// </summary>
    public string BuyerLocation { get; set; } = string.Empty;
    
    // Denormalized vendor information
    
    /// <summary>
    /// Vendor name (denormalized from Identity Service)
    /// </summary>
    public string VendorName { get; set; } = string.Empty;
    
    /// <summary>
    /// Vendor type/classification (Material Supplier, Labor Provider, etc.)
    /// </summary>
    public string VendorType { get; set; } = string.Empty;
    
    /// <summary>
    /// Vendor phone number (denormalized)
    /// </summary>
    public string VendorPhone { get; set; } = string.Empty;
    
    // Offer and acceptance tracking
    
    /// <summary>
    /// When the order was offered to the vendor
    /// </summary>
    public DateTime? OfferedAt { get; set; }
    
    /// <summary>
    /// Deadline for vendor to accept the offer
    /// </summary>
    public DateTime? OfferExpiresAt { get; set; }
    
    /// <summary>
    /// When vendor responded to the offer (accepted or rejected)
    /// </summary>
    public DateTime? RespondedAt { get; set; }
    
    /// <summary>
    /// When vendor accepted the order
    /// </summary>
    public DateTime? AcceptedAt { get; set; }
    
    /// <summary>
    /// When vendor rejected the order
    /// </summary>
    public DateTime? RejectedAt { get; set; }
    
    /// <summary>
    /// Reason for rejection (if rejected)
    /// </summary>
    public string? RejectionReason { get; set; }
    
    // Rating and Review
    
    /// <summary>
    /// Customer rating (1-5 stars)
    /// </summary>
    public int? Rating { get; set; }
    
    /// <summary>
    /// Customer review text
    /// </summary>
    public string? ReviewText { get; set; }
    
    /// <summary>
    /// When the review was submitted
    /// </summary>
    public DateTime? ReviewedAt { get; set; }
    
    // Settlement tracking
    
    /// <summary>
    /// Settlement ID if order has been settled with vendor
    /// </summary>
    public Guid? SettlementId { get; set; }
    
    /// <summary>
    /// Date when settlement was processed
    /// </summary>
    public DateTime? SettlementDate { get; set; }
    
    /// <summary>
    /// Settlement status (pending, processing, settled)
    /// </summary>
    public string? SettlementStatus { get; set; }
    
    // Delivery time slot
    
    /// <summary>
    /// Delivery slot start time
    /// </summary>
    public TimeSpan? DeliverySlotStart { get; set; }
    
    /// <summary>
    /// Delivery slot end time
    /// </summary>
    public TimeSpan? DeliverySlotEnd { get; set; }
    
    // Dispute tracking
    
    /// <summary>
    /// Active dispute ID (if any)
    /// </summary>
    public Guid? DisputeId { get; set; }
    
    /// <summary>
    /// Whether order has an active dispute
    /// </summary>
    public bool HasActiveDispute { get; set; }
    
    /// <summary>
    /// Payment information
    /// </summary>
    public Payment? Payment { get; set; }
    
    /// <summary>
    /// Delivery information
    /// </summary>
    public Delivery? Delivery { get; set; }
    
    /// <summary>
    /// Order status history
    /// </summary>
    public ICollection<OrderStatusHistory> StatusHistory { get; set; } = new List<OrderStatusHistory>();
    
    /// <summary>
    /// Customer notes/instructions
    /// </summary>
    public string? CustomerNotes { get; set; }
    
    /// <summary>
    /// Vendor notes (internal)
    /// </summary>
    public string? VendorNotes { get; set; }
    
    /// <summary>
    /// Expected delivery date
    /// </summary>
    public DateTime? ExpectedDeliveryDate { get; set; }
    
    /// <summary>
    /// Actual delivery date
    /// </summary>
    public DateTime? ActualDeliveryDate { get; set; }
    
    /// <summary>
    /// Cancellation reason
    /// </summary>
    public string? CancellationReason { get; set; }
    
    /// <summary>
    /// Order created timestamp
    /// </summary>
    public DateTime CreatedAt { get; set; }
    
    /// <summary>
    /// Order last updated timestamp
    /// </summary>
    public DateTime UpdatedAt { get; set; }
}