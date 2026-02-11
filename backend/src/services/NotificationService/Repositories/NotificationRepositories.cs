using Microsoft.EntityFrameworkCore;
using NotificationService.Data;
using NotificationService.Models.Entities;
using NotificationService.Repositories.Interfaces;

namespace NotificationService.Repositories;

public class NotificationRepository : INotificationRepository
{
    private readonly NotificationDbContext _context;

    public NotificationRepository(NotificationDbContext context)
    {
        _context = context;
    }

    public async Task<Notification> CreateAsync(Notification notification)
    {
        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();
        return notification;
    }

    public async Task<Notification?> GetByIdAsync(Guid id)
    {
        return await _context.Notifications.FindAsync(id);
    }

    public async Task<List<Notification>> GetByRecipientIdAsync(Guid recipientId, int page = 1, int pageSize = 20)
    {
        return await _context.Notifications
            .Where(n => n.RecipientId == recipientId)
            .OrderByDescending(n => n.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> CountByRecipientIdAsync(Guid recipientId)
    {
        return await _context.Notifications
            .CountAsync(n => n.RecipientId == recipientId);
    }

    public async Task<Notification> UpdateAsync(Notification notification)
    {
        _context.Notifications.Update(notification);
        await _context.SaveChangesAsync();
        return notification;
    }

    public async Task<List<Notification>> GetPendingNotificationsAsync(int limit = 100)
    {
        return await _context.Notifications
            .Where(n => n.Status == "pending")
            .OrderBy(n => n.CreatedAt)
            .Take(limit)
            .ToListAsync();
    }
}

public class NotificationTemplateRepository : INotificationTemplateRepository
{
    private readonly NotificationDbContext _context;

    public NotificationTemplateRepository(NotificationDbContext context)
    {
        _context = context;
    }

    public async Task<NotificationTemplate> CreateAsync(NotificationTemplate template)
    {
        _context.NotificationTemplates.Add(template);
        await _context.SaveChangesAsync();
        return template;
    }

    public async Task<NotificationTemplate?> GetByIdAsync(Guid id)
    {
        return await _context.NotificationTemplates.FindAsync(id);
    }

    public async Task<NotificationTemplate?> GetByNameAsync(string templateName)
    {
        return await _context.NotificationTemplates
            .FirstOrDefaultAsync(t => t.TemplateName == templateName);
    }

    public async Task<List<NotificationTemplate>> GetAllAsync()
    {
        return await _context.NotificationTemplates
            .OrderBy(t => t.TemplateName)
            .ToListAsync();
    }

    public async Task<List<NotificationTemplate>> GetByTypeAsync(string templateType)
    {
        return await _context.NotificationTemplates
            .Where(t => t.TemplateType == templateType && t.IsActive)
            .OrderBy(t => t.TemplateName)
            .ToListAsync();
    }

    public async Task<NotificationTemplate> UpdateAsync(NotificationTemplate template)
    {
        _context.NotificationTemplates.Update(template);
        await _context.SaveChangesAsync();
        return template;
    }

    public async Task DeleteAsync(Guid id)
    {
        var template = await _context.NotificationTemplates.FindAsync(id);
        if (template != null)
        {
            _context.NotificationTemplates.Remove(template);
            await _context.SaveChangesAsync();
        }
    }
}

public class UserNotificationPreferenceRepository : IUserNotificationPreferenceRepository
{
    private readonly NotificationDbContext _context;

    public UserNotificationPreferenceRepository(NotificationDbContext context)
    {
        _context = context;
    }

    public async Task<UserNotificationPreference> CreateAsync(UserNotificationPreference preference)
    {
        _context.UserNotificationPreferences.Add(preference);
        await _context.SaveChangesAsync();
        return preference;
    }

    public async Task<UserNotificationPreference?> GetByUserIdAsync(Guid userId)
    {
        return await _context.UserNotificationPreferences
            .FirstOrDefaultAsync(p => p.UserId == userId);
    }

    public async Task<UserNotificationPreference> UpdateAsync(UserNotificationPreference preference)
    {
        _context.UserNotificationPreferences.Update(preference);
        await _context.SaveChangesAsync();
        return preference;
    }
}
