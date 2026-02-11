using System.ComponentModel.DataAnnotations;

namespace PaymentService.Models.Requests;

public class CreatePaymentRequest
{
    [Required(ErrorMessage = "Order ID is required")]
    public Guid OrderId { get; set; }

    [Required(ErrorMessage = "Buyer ID is required")]
    public Guid BuyerId { get; set; }

    public Guid? VendorId { get; set; }

    [Required(ErrorMessage = "Amount is required")]
    [Range(1, 10000000, ErrorMessage = "Amount must be between 1 and 10,000,000")]
    public decimal Amount { get; set; }

    [Required(ErrorMessage = "Currency is required")]
    [StringLength(3, MinimumLength = 3, ErrorMessage = "Currency must be 3 characters")]
    public string Currency { get; set; } = "INR";

    [Required(ErrorMessage = "Payment method is required")]
    [StringLength(50)]
    public string PaymentMethod { get; set; } = null!; // online, cod

    [StringLength(2000)]
    public string? Metadata { get; set; }

    [StringLength(1000)]
    public string? Notes { get; set; }
}
