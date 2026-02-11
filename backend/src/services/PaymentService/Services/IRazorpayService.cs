namespace PaymentService.Services;

public interface IRazorpayService
{
    Task<Dictionary<string, object>> CreateOrderAsync(decimal amount, string currency, string receiptId, Dictionary<string, object>? notes = null);
    Task<Dictionary<string, object>> GetOrderAsync(string orderId);
    Task<Dictionary<string, object>> CapturePaymentAsync(string paymentId, decimal amount, string currency);
    Task<Dictionary<string, object>> CreateRefundAsync(string paymentId, decimal? amount = null, Dictionary<string, object>? notes = null);
    Task<Dictionary<string, object>> GetRefundAsync(string refundId);
    bool VerifyPaymentSignature(string orderId, string paymentId, string signature);
    bool VerifyWebhookSignature(string payload, string signature);
}
