using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PaymentService.Models.Entities;

[Table("payment_webhooks")]
public class PaymentWebhook
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Column("payment_id")]
    public Guid? PaymentId { get; set; }

    [Required]
    [Column("event_type")]
    [StringLength(100)]
    public string EventType { get; set; } = null!; // payment.authorized, payment.captured, payment.failed

    [Required]
    [Column("payload")]
    [Column(TypeName = "jsonb")]
    public string Payload { get; set; } = null!; // Full webhook JSON payload

    [Required]
    [Column("signature")]
    [StringLength(200)]
    public string Signature { get; set; } = null!;

    [Required]
    [Column("is_verified")]
    public bool IsVerified { get; set; } = false;

    [Required]
    [Column("is_processed")]
    public bool IsProcessed { get; set; } = false;

    [Column("processing_error")]
    [StringLength(1000)]
    public string? ProcessingError { get; set; }

    [Column("razorpay_event_id")]
    [StringLength(100)]
    public string? RazorpayEventId { get; set; }

    [Column("ip_address")]
    [StringLength(50)]
    public string? IpAddress { get; set; }

    // Timestamps
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("processed_at")]
    public DateTime? ProcessedAt { get; set; }

    // Navigation properties
    [ForeignKey("PaymentId")]
    public virtual Payment? Payment { get; set; }
}
