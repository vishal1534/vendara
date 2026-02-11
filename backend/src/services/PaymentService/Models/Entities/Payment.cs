using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PaymentService.Models.Entities;

[Table("payments")]
public class Payment
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [Column("order_id")]
    public Guid OrderId { get; set; }

    [Required]
    [Column("buyer_id")]
    public Guid BuyerId { get; set; }

    [Column("vendor_id")]
    public Guid? VendorId { get; set; }

    [Required]
    [Column("amount")]
    [Precision(18, 2)]
    public decimal Amount { get; set; }

    [Required]
    [Column("currency")]
    [StringLength(3)]
    public string Currency { get; set; } = "INR";

    [Required]
    [Column("payment_method")]
    [StringLength(50)]
    public string PaymentMethod { get; set; } = null!; // online, cod, upi, card, netbanking

    [Required]
    [Column("payment_status")]
    [StringLength(50)]
    public string PaymentStatus { get; set; } = "pending"; // pending, processing, success, failed, refunded

    // Razorpay fields
    [Column("razorpay_order_id")]
    [StringLength(100)]
    public string? RazorpayOrderId { get; set; }

    [Column("razorpay_payment_id")]
    [StringLength(100)]
    public string? RazorpayPaymentId { get; set; }

    [Column("razorpay_signature")]
    [StringLength(200)]
    public string? RazorpaySignature { get; set; }

    // Payment details
    [Column("payment_gateway")]
    [StringLength(50)]
    public string? PaymentGateway { get; set; } // razorpay, paytm, phonepe

    [Column("transaction_id")]
    [StringLength(100)]
    public string? TransactionId { get; set; }

    [Column("payment_error_code")]
    [StringLength(50)]
    public string? PaymentErrorCode { get; set; }

    [Column("payment_error_message")]
    [StringLength(500)]
    public string? PaymentErrorMessage { get; set; }

    // Metadata
    [Column("metadata")]
    [StringLength(2000)]
    public string? Metadata { get; set; } // JSON string

    [Column("notes")]
    [StringLength(1000)]
    public string? Notes { get; set; }

    // Timestamps
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [Column("completed_at")]
    public DateTime? CompletedAt { get; set; }

    [Column("failed_at")]
    public DateTime? FailedAt { get; set; }

    // Navigation properties
    public virtual ICollection<PaymentRefund> Refunds { get; set; } = new List<PaymentRefund>();
    public virtual ICollection<PaymentWebhook> Webhooks { get; set; } = new List<PaymentWebhook>();
}
