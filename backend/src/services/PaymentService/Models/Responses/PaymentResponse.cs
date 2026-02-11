namespace PaymentService.Models.Responses;

public class PaymentResponse
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public Guid BuyerId { get; set; }
    public Guid? VendorId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "INR";
    public string PaymentMethod { get; set; } = null!;
    public string PaymentStatus { get; set; } = null!;
    public string? RazorpayOrderId { get; set; }
    public string? RazorpayPaymentId { get; set; }
    public string? PaymentGateway { get; set; }
    public string? TransactionId { get; set; }
    public string? PaymentErrorCode { get; set; }
    public string? PaymentErrorMessage { get; set; }
    public string? Metadata { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime? FailedAt { get; set; }
}
