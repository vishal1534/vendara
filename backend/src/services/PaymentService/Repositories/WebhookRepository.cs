using Microsoft.EntityFrameworkCore;
using PaymentService.Data;
using PaymentService.Models.Entities;

namespace PaymentService.Repositories;

public class WebhookRepository : IWebhookRepository
{
    private readonly PaymentDbContext _context;

    public WebhookRepository(PaymentDbContext context)
    {
        _context = context;
    }

    public async Task<PaymentWebhook?> GetByIdAsync(Guid id)
    {
        return await _context.PaymentWebhooks
            .Include(w => w.Payment)
            .FirstOrDefaultAsync(w => w.Id == id);
    }

    public async Task<List<PaymentWebhook>> GetAllAsync(int page, int pageSize)
    {
        return await _context.PaymentWebhooks
            .OrderByDescending(w => w.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<List<PaymentWebhook>> GetUnprocessedAsync(int limit = 100)
    {
        return await _context.PaymentWebhooks
            .Where(w => !w.IsProcessed)
            .OrderBy(w => w.CreatedAt)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<PaymentWebhook> CreateAsync(PaymentWebhook webhook)
    {
        _context.PaymentWebhooks.Add(webhook);
        await _context.SaveChangesAsync();
        return webhook;
    }

    public async Task<PaymentWebhook> UpdateAsync(PaymentWebhook webhook)
    {
        _context.PaymentWebhooks.Update(webhook);
        await _context.SaveChangesAsync();
        return webhook;
    }

    public async Task<int> GetTotalCountAsync()
    {
        return await _context.PaymentWebhooks.CountAsync();
    }
}
