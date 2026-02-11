using System.ComponentModel.DataAnnotations;

namespace PaymentService.Models.Requests;

public class VerifyPaymentRequest
{
    [Required(ErrorMessage = "Razorpay order ID is required")]
    public string RazorpayOrderId { get; set; } = null!;

    [Required(ErrorMessage = "Razorpay payment ID is required")]
    public string RazorpayPaymentId { get; set; } = null!;

    [Required(ErrorMessage = "Razorpay signature is required")]
    public string RazorpaySignature { get; set; } = null!;
}
