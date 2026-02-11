using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PaymentService.Models.Entities;

[Table("payment_refunds")]
public class PaymentRefund
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [Column("payment_id")]
    public Guid PaymentId { get; set; }

    [Required]
    [Column("amount")]
    [Precision(18, 2)]
    public decimal Amount { get; set; }

    [Required]
    [Column("currency")]
    [StringLength(3)]
    public string Currency { get; set; } = "INR";

    [Required]
    [Column("refund_reason")]
    [StringLength(500)]
    public string RefundReason { get; set; } = null!;

    [Required]
    [Column("refund_status")]
    [StringLength(50)]
    public string RefundStatus { get; set; } = "pending"; // pending, processing, completed, failed

    // Razorpay fields
    [Column("razorpay_refund_id")]
    [StringLength(100)]
    public string? RazorpayRefundId { get; set; }

    [Column("refund_error_code")]
    [StringLength(50)]
    public string? RefundErrorCode { get; set; }

    [Column("refund_error_message")]
    [StringLength(500)]
    public string? RefundErrorMessage { get; set; }

    [Column("initiated_by")]
    public Guid? InitiatedBy { get; set; } // Admin/Vendor user ID

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

    // Navigation properties
    [ForeignKey("PaymentId")]
    public virtual Payment Payment { get; set; } = null!;
}
