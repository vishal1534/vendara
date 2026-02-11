using System.ComponentModel.DataAnnotations;

namespace PaymentService.Models.Requests;

public class UpdatePaymentStatusRequest
{
    [Required(ErrorMessage = "Payment status is required")]
    [StringLength(50)]
    public string PaymentStatus { get; set; } = null!; // success, failed, refunded

    [StringLength(50)]
    public string? PaymentErrorCode { get; set; }

    [StringLength(500)]
    public string? PaymentErrorMessage { get; set; }

    [StringLength(1000)]
    public string? Notes { get; set; }
}
