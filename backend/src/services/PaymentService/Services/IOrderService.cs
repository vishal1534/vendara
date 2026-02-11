namespace PaymentService.Services;

public interface IOrderService
{
    Task<bool> MarkOrderAsPaidAsync(Guid orderId, Guid paymentId);
    Task<bool> ValidateOrderForPaymentAsync(Guid orderId, decimal amount);
    Task<OrderDetails?> GetOrderDetailsAsync(Guid orderId);
}

public class OrderDetails
{
    public Guid Id { get; set; }
    public Guid BuyerId { get; set; }
    public Guid? VendorId { get; set; }
    public decimal Total { get; set; }
    public string Status { get; set; } = null!;
    public string PaymentStatus { get; set; } = null!;
}
