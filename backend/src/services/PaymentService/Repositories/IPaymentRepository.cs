using PaymentService.Models.Entities;

namespace PaymentService.Repositories;

public interface IPaymentRepository
{
    Task<Payment?> GetByIdAsync(Guid id);
    Task<Payment?> GetByOrderIdAsync(Guid orderId);
    Task<Payment?> GetByRazorpayOrderIdAsync(string razorpayOrderId);
    Task<List<Payment>> GetByBuyerIdAsync(Guid buyerId, int page, int pageSize);
    Task<List<Payment>> GetByVendorIdAsync(Guid vendorId, int page, int pageSize);
    Task<List<Payment>> GetAllAsync(int page, int pageSize, string? status = null);
    Task<Payment> CreateAsync(Payment payment);
    Task<Payment> UpdateAsync(Payment payment);
    Task<int> GetTotalCountAsync(string? status = null);
    Task<int> GetBuyerPaymentCountAsync(Guid buyerId);
    Task<int> GetVendorPaymentCountAsync(Guid vendorId);
    Task<List<Payment>> GetCompletedPaymentsByVendorAsync(Guid vendorId, DateTime startDate, DateTime endDate);
    Task<decimal> GetTotalRevenueAsync(DateTime? startDate = null, DateTime? endDate = null);
}
