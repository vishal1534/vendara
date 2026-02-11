using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PaymentService.Models.Entities;

[Table("vendor_settlements")]
public class VendorSettlement
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [Column("vendor_id")]
    public Guid VendorId { get; set; }

    [Required]
    [Column("period_start")]
    public DateTime PeriodStart { get; set; }

    [Required]
    [Column("period_end")]
    public DateTime PeriodEnd { get; set; }

    [Required]
    [Column("total_orders")]
    public int TotalOrders { get; set; }

    [Required]
    [Column("total_amount")]
    [Precision(18, 2)]
    public decimal TotalAmount { get; set; }

    [Required]
    [Column("commission_percentage")]
    [Precision(5, 2)]
    public decimal CommissionPercentage { get; set; }

    [Required]
    [Column("commission_amount")]
    [Precision(18, 2)]
    public decimal CommissionAmount { get; set; }

    [Required]
    [Column("settlement_amount")]
    [Precision(18, 2)]
    public decimal SettlementAmount { get; set; }

    [Column("tax_amount")]
    [Precision(18, 2)]
    public decimal TaxAmount { get; set; } = 0;

    [Column("adjustment_amount")]
    [Precision(18, 2)]
    public decimal AdjustmentAmount { get; set; } = 0;

    [Column("adjustment_reason")]
    [StringLength(500)]
    public string? AdjustmentReason { get; set; }

    [Required]
    [Column("settlement_status")]
    [StringLength(50)]
    public string SettlementStatus { get; set; } = "pending"; // pending, processing, completed, failed

    [Column("settlement_method")]
    [StringLength(50)]
    public string? SettlementMethod { get; set; } // bank_transfer, upi, check

    [Column("bank_account_id")]
    public Guid? BankAccountId { get; set; }

    [Column("utr_number")]
    [StringLength(100)]
    public string? UtrNumber { get; set; } // Unique Transaction Reference

    [Column("processed_by")]
    public Guid? ProcessedBy { get; set; } // Admin user ID

    [Column("notes")]
    [StringLength(1000)]
    public string? Notes { get; set; }

    // Timestamps
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [Column("processed_at")]
    public DateTime? ProcessedAt { get; set; }

    // Navigation properties
    public virtual ICollection<SettlementLineItem> LineItems { get; set; } = new List<SettlementLineItem>();
}
