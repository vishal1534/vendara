using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PaymentService.Models.Entities;

[Table("settlement_line_items")]
public class SettlementLineItem
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [Column("settlement_id")]
    public Guid SettlementId { get; set; }

    [Required]
    [Column("payment_id")]
    public Guid PaymentId { get; set; }

    [Required]
    [Column("order_id")]
    public Guid OrderId { get; set; }

    [Required]
    [Column("order_amount")]
    [Precision(18, 2)]
    public decimal OrderAmount { get; set; }

    [Required]
    [Column("commission_amount")]
    [Precision(18, 2)]
    public decimal CommissionAmount { get; set; }

    [Required]
    [Column("settlement_amount")]
    [Precision(18, 2)]
    public decimal SettlementAmount { get; set; }

    [Column("order_date")]
    public DateTime OrderDate { get; set; }

    [Column("payment_date")]
    public DateTime? PaymentDate { get; set; }

    // Navigation properties
    [ForeignKey("SettlementId")]
    public virtual VendorSettlement Settlement { get; set; } = null!;
}
