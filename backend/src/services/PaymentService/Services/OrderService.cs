using System.Text.Json;

namespace PaymentService.Services;

public class OrderService : IOrderService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<OrderService> _logger;

    public OrderService(HttpClient httpClient, ILogger<OrderService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<bool> MarkOrderAsPaidAsync(Guid orderId, Guid paymentId)
    {
        try
        {
            var request = new
            {
                paymentId = paymentId,
                paymentStatus = "paid"
            };

            var response = await _httpClient.PatchAsJsonAsync(
                $"/api/v1/orders/{orderId}/payment-status",
                request
            );

            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("Order {OrderId} marked as paid with payment {PaymentId}", 
                    orderId, paymentId);
                return true;
            }

            _logger.LogWarning("Failed to mark order {OrderId} as paid. Status: {Status}", 
                orderId, response.StatusCode);
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking order {OrderId} as paid", orderId);
            return false;
        }
    }

    public async Task<bool> ValidateOrderForPaymentAsync(Guid orderId, decimal amount)
    {
        try
        {
            var order = await GetOrderDetailsAsync(orderId);
            
            if (order == null)
            {
                _logger.LogWarning("Order {OrderId} not found for payment validation", orderId);
                return false;
            }

            if (order.Status == "cancelled")
            {
                _logger.LogWarning("Cannot create payment for cancelled order {OrderId}", orderId);
                return false;
            }

            if (order.PaymentStatus == "paid")
            {
                _logger.LogWarning("Order {OrderId} is already paid", orderId);
                return false;
            }

            if (Math.Abs(order.Total - amount) > 0.01m)
            {
                _logger.LogWarning("Payment amount {Amount} does not match order total {Total} for order {OrderId}", 
                    amount, order.Total, orderId);
                return false;
            }

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating order {OrderId} for payment", orderId);
            return false;
        }
    }

    public async Task<OrderDetails?> GetOrderDetailsAsync(Guid orderId)
    {
        try
        {
            var response = await _httpClient.GetAsync($"/api/v1/orders/{orderId}");
            
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Failed to get order {OrderId}. Status: {Status}", 
                    orderId, response.StatusCode);
                return null;
            }

            var content = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<ApiResponse<OrderDetails>>(content, 
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            return result?.Data;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting order details for {OrderId}", orderId);
            return null;
        }
    }

    private class ApiResponse<T>
    {
        public bool Success { get; set; }
        public T? Data { get; set; }
    }
}
