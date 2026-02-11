using OrderService.Models.Enums;

namespace OrderService.Models.Entities;

/// <summary>
/// Payment entity for order payment tracking
/// </summary>
public class Payment
{
    /// <summary>
    /// Unique payment identifier
    /// </summary>
    public Guid Id { get; set; }
    
    /// <summary>
    /// Order ID
    /// </summary>
    public Guid OrderId { get; set; }
    
    /// <summary>
    /// Order reference
    /// </summary>
    public Order Order { get; set; } = null!;
    
    /// <summary>
    /// Payment method
    /// </summary>
    public PaymentMethod PaymentMethod { get; set; }
    
    /// <summary>
    /// Payment status
    /// </summary>
    public PaymentStatus Status { get; set; }
    
    /// <summary>
    /// Total payment amount
    /// </summary>
    public decimal Amount { get; set; }
    
    /// <summary>
    /// Amount paid so far
    /// </summary>
    public decimal AmountPaid { get; set; }
    
    /// <summary>
    /// Amount refunded
    /// </summary>
    public decimal AmountRefunded { get; set; }
    
    /// <summary>
    /// Payment gateway transaction ID
    /// </summary>
    public string? TransactionId { get; set; }
    
    /// <summary>
    /// Payment gateway reference
    /// </summary>
    public string? GatewayReference { get; set; }
    
    /// <summary>
    /// Payment gateway name (Razorpay, Paytm, etc.)
    /// </summary>
    public string? Gateway { get; set; }
    
    /// <summary>
    /// Payment due date
    /// </summary>
    public DateTime? DueDate { get; set; }
    
    /// <summary>
    /// Payment completed date
    /// </summary>
    public DateTime? PaidAt { get; set; }
    
    /// <summary>
    /// Payment failure reason
    /// </summary>
    public string? FailureReason { get; set; }
    
    /// <summary>
    /// Payment notes
    /// </summary>
    public string? Notes { get; set; }
    
    /// <summary>
    /// Payment created timestamp
    /// </summary>
    public DateTime CreatedAt { get; set; }
    
    /// <summary>
    /// Payment last updated timestamp
    /// </summary>
    public DateTime UpdatedAt { get; set; }
}
