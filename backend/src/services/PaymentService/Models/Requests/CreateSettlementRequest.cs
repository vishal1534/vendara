using System.ComponentModel.DataAnnotations;

namespace PaymentService.Models.Requests;

public class CreateSettlementRequest
{
    [Required(ErrorMessage = "Vendor ID is required")]
    public Guid VendorId { get; set; }

    [Required(ErrorMessage = "Period start is required")]
    public DateTime PeriodStart { get; set; }

    [Required(ErrorMessage = "Period end is required")]
    public DateTime PeriodEnd { get; set; }

    [Range(0, 100, ErrorMessage = "Commission percentage must be between 0 and 100")]
    public decimal? CommissionPercentage { get; set; }

    [Range(-1000000, 1000000, ErrorMessage = "Adjustment amount must be between -1,000,000 and 1,000,000")]
    public decimal? AdjustmentAmount { get; set; }

    [StringLength(500)]
    public string? AdjustmentReason { get; set; }

    [StringLength(1000)]
    public string? Notes { get; set; }
}
