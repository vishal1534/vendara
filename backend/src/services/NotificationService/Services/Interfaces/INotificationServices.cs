using NotificationService.Models.DTOs;
using NotificationService.Models.Requests;

namespace NotificationService.Services.Interfaces;

public interface IEmailService
{
    Task<(bool Success, string? MessageId, string? Error)> SendEmailAsync(
        string toEmail,
        string subject,
        string body,
        string? htmlBody = null
    );
}

public interface IWhatsAppService
{
    Task<(bool Success, string? MessageId, string? Error)> SendTemplateMessageAsync(
        string phoneNumber,
        string templateName,
        string language,
        Dictionary<string, string>? parameters = null
    );
}

public interface ISmsService
{
    Task<(bool Success, string? MessageId, string? Error)> SendSmsAsync(
        string phoneNumber,
        string message
    );
}

public interface IPushNotificationService
{
    Task<(bool Success, string? MessageId, string? Error)> SendPushNotificationAsync(
        string deviceToken,
        string title,
        string body,
        Dictionary<string, string>? data = null
    );
}

public interface INotificationService
{
    Task<NotificationDto> SendEmailNotificationAsync(SendEmailRequest request);
    Task<NotificationDto> SendWhatsAppNotificationAsync(SendWhatsAppRequest request);
    Task<NotificationDto> SendSmsNotificationAsync(SendSmsRequest request);
    Task<NotificationDto> SendPushNotificationAsync(SendPushRequest request);
    Task<NotificationDto?> GetNotificationByIdAsync(Guid id);
    Task<(List<NotificationDto> Notifications, int TotalCount)> GetUserNotificationsAsync(Guid userId, int page, int pageSize);
}

public interface INotificationTemplateService
{
    Task<NotificationTemplateDto> CreateTemplateAsync(CreateTemplateRequest request);
    Task<NotificationTemplateDto> UpdateTemplateAsync(Guid id, UpdateTemplateRequest request);
    Task<NotificationTemplateDto?> GetTemplateByIdAsync(Guid id);
    Task<NotificationTemplateDto?> GetTemplateByNameAsync(string templateName);
    Task<List<NotificationTemplateDto>> GetAllTemplatesAsync();
    Task DeleteTemplateAsync(Guid id);
}

public interface IUserNotificationPreferenceService
{
    Task<UserNotificationPreferenceDto> GetOrCreatePreferencesAsync(Guid userId);
    Task<UserNotificationPreferenceDto> UpdatePreferencesAsync(Guid userId, UpdatePreferencesRequest request);
}
