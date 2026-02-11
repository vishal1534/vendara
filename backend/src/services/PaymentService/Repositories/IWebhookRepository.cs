using PaymentService.Models.Entities;

namespace PaymentService.Repositories;

public interface IWebhookRepository
{
    Task<PaymentWebhook?> GetByIdAsync(Guid id);
    Task<List<PaymentWebhook>> GetAllAsync(int page, int pageSize);
    Task<List<PaymentWebhook>> GetUnprocessedAsync(int limit = 100);
    Task<PaymentWebhook> CreateAsync(PaymentWebhook webhook);
    Task<PaymentWebhook> UpdateAsync(PaymentWebhook webhook);
    Task<int> GetTotalCountAsync();
}
