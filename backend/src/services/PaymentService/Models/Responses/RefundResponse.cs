namespace PaymentService.Models.Responses;

public class RefundResponse
{
    public Guid Id { get; set; }
    public Guid PaymentId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "INR";
    public string RefundReason { get; set; } = null!;
    public string RefundStatus { get; set; } = null!;
    public string? RazorpayRefundId { get; set; }
    public string? RefundErrorCode { get; set; }
    public string? RefundErrorMessage { get; set; }
    public Guid? InitiatedBy { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}
