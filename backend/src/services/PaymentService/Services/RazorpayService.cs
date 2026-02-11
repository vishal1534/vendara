using Razorpay.Api;
using System.Security.Cryptography;
using System.Text;

namespace PaymentService.Services;

public class RazorpayService : IRazorpayService
{
    private readonly RazorpayClient _client;
    private readonly string _keySecret;
    private readonly string _webhookSecret;
    private readonly ILogger<RazorpayService> _logger;

    public RazorpayService(IConfiguration configuration, ILogger<RazorpayService> logger)
    {
        var keyId = configuration["Razorpay:KeyId"] ?? throw new InvalidOperationException("Razorpay KeyId not configured");
        _keySecret = configuration["Razorpay:KeySecret"] ?? throw new InvalidOperationException("Razorpay KeySecret not configured");
        _webhookSecret = configuration["Razorpay:WebhookSecret"] ?? throw new InvalidOperationException("Razorpay WebhookSecret not configured");
        
        _client = new RazorpayClient(keyId, _keySecret);
        _logger = logger;
    }

    public async Task<Dictionary<string, object>> CreateOrderAsync(decimal amount, string currency, string receiptId, Dictionary<string, object>? notes = null)
    {
        try
        {
            var options = new Dictionary<string, object>
            {
                { "amount", (int)(amount * 100) }, // Convert to paise
                { "currency", currency },
                { "receipt", receiptId }
            };

            if (notes != null)
            {
                options.Add("notes", notes);
            }

            var order = _client.Order.Create(options);
            _logger.LogInformation("Created Razorpay order: {OrderId}", order["id"]);
            
            return order;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create Razorpay order for receipt: {ReceiptId}", receiptId);
            throw;
        }
    }

    public async Task<Dictionary<string, object>> GetOrderAsync(string orderId)
    {
        try
        {
            var order = _client.Order.Fetch(orderId);
            return order;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to fetch Razorpay order: {OrderId}", orderId);
            throw;
        }
    }

    public async Task<Dictionary<string, object>> CapturePaymentAsync(string paymentId, decimal amount, string currency)
    {
        try
        {
            var options = new Dictionary<string, object>
            {
                { "amount", (int)(amount * 100) }, // Convert to paise
                { "currency", currency }
            };

            var payment = _client.Payment.Fetch(paymentId).Capture(options);
            _logger.LogInformation("Captured Razorpay payment: {PaymentId}", paymentId);
            
            return payment;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to capture Razorpay payment: {PaymentId}", paymentId);
            throw;
        }
    }

    public async Task<Dictionary<string, object>> CreateRefundAsync(string paymentId, decimal? amount = null, Dictionary<string, object>? notes = null)
    {
        try
        {
            var options = new Dictionary<string, object>();

            if (amount.HasValue)
            {
                options.Add("amount", (int)(amount.Value * 100)); // Convert to paise
            }

            if (notes != null)
            {
                options.Add("notes", notes);
            }

            var refund = _client.Payment.Fetch(paymentId).Refund(options);
            _logger.LogInformation("Created Razorpay refund for payment: {PaymentId}", paymentId);
            
            return refund;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create Razorpay refund for payment: {PaymentId}", paymentId);
            throw;
        }
    }

    public async Task<Dictionary<string, object>> GetRefundAsync(string refundId)
    {
        try
        {
            var refund = _client.Refund.Fetch(refundId);
            return refund;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to fetch Razorpay refund: {RefundId}", refundId);
            throw;
        }
    }

    public bool VerifyPaymentSignature(string orderId, string paymentId, string signature)
    {
        try
        {
            var payload = $"{orderId}|{paymentId}";
            var expectedSignature = ComputeHmacSha256(payload, _keySecret);
            
            var isValid = signature.Equals(expectedSignature, StringComparison.OrdinalIgnoreCase);
            
            if (!isValid)
            {
                _logger.LogWarning("Invalid payment signature for order: {OrderId}", orderId);
            }
            
            return isValid;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying payment signature for order: {OrderId}", orderId);
            return false;
        }
    }

    public bool VerifyWebhookSignature(string payload, string signature)
    {
        try
        {
            var expectedSignature = ComputeHmacSha256(payload, _webhookSecret);
            
            var isValid = signature.Equals(expectedSignature, StringComparison.OrdinalIgnoreCase);
            
            if (!isValid)
            {
                _logger.LogWarning("Invalid webhook signature");
            }
            
            return isValid;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying webhook signature");
            return false;
        }
    }

    private string ComputeHmacSha256(string message, string secret)
    {
        var keyBytes = Encoding.UTF8.GetBytes(secret);
        var messageBytes = Encoding.UTF8.GetBytes(message);
        
        using var hmac = new HMACSHA256(keyBytes);
        var hashBytes = hmac.ComputeHash(messageBytes);
        
        return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
    }
}
