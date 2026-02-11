using NotificationService.Models.Entities;

namespace NotificationService.Repositories.Interfaces;

public interface INotificationRepository
{
    Task<Notification> CreateAsync(Notification notification);
    Task<Notification?> GetByIdAsync(Guid id);
    Task<List<Notification>> GetByRecipientIdAsync(Guid recipientId, int page = 1, int pageSize = 20);
    Task<int> CountByRecipientIdAsync(Guid recipientId);
    Task<Notification> UpdateAsync(Notification notification);
    Task<List<Notification>> GetPendingNotificationsAsync(int limit = 100);
}

public interface INotificationTemplateRepository
{
    Task<NotificationTemplate> CreateAsync(NotificationTemplate template);
    Task<NotificationTemplate?> GetByIdAsync(Guid id);
    Task<NotificationTemplate?> GetByNameAsync(string templateName);
    Task<List<NotificationTemplate>> GetAllAsync();
    Task<List<NotificationTemplate>> GetByTypeAsync(string templateType);
    Task<NotificationTemplate> UpdateAsync(NotificationTemplate template);
    Task DeleteAsync(Guid id);
}

public interface IUserNotificationPreferenceRepository
{
    Task<UserNotificationPreference> CreateAsync(UserNotificationPreference preference);
    Task<UserNotificationPreference?> GetByUserIdAsync(Guid userId);
    Task<UserNotificationPreference> UpdateAsync(UserNotificationPreference preference);
}
