using System.ComponentModel.DataAnnotations;

namespace PaymentService.Models.Requests;

public class CreateRefundRequest
{
    [Required(ErrorMessage = "Payment ID is required")]
    public Guid PaymentId { get; set; }

    [Range(1, 10000000, ErrorMessage = "Amount must be between 1 and 10,000,000")]
    public decimal? Amount { get; set; } // null = full refund

    [Required(ErrorMessage = "Refund reason is required")]
    [StringLength(500, MinimumLength = 10, ErrorMessage = "Refund reason must be between 10 and 500 characters")]
    public string RefundReason { get; set; } = null!;

    [StringLength(1000)]
    public string? Notes { get; set; }
}
