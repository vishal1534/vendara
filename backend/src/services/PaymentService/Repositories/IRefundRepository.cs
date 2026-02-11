using PaymentService.Models.Entities;

namespace PaymentService.Repositories;

public interface IRefundRepository
{
    Task<PaymentRefund?> GetByIdAsync(Guid id);
    Task<List<PaymentRefund>> GetByPaymentIdAsync(Guid paymentId);
    Task<List<PaymentRefund>> GetAllAsync(int page, int pageSize, string? status = null);
    Task<PaymentRefund> CreateAsync(PaymentRefund refund);
    Task<PaymentRefund> UpdateAsync(PaymentRefund refund);
    Task<int> GetTotalCountAsync(string? status = null);
    Task<decimal> GetTotalRefundAmountAsync(DateTime? startDate = null, DateTime? endDate = null);
}
