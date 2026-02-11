using System.Text.Json;
using NotificationService.Models.DTOs;
using NotificationService.Models.Entities;
using NotificationService.Models.Requests;
using NotificationService.Repositories.Interfaces;
using NotificationService.Services.Interfaces;

namespace NotificationService.Services;

public class NotificationManagementService : INotificationService
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IEmailService _emailService;
    private readonly IWhatsAppService _whatsAppService;
    private readonly ISmsService _smsService;
    private readonly IPushNotificationService _pushService;
    private readonly ILogger<NotificationManagementService> _logger;

    public NotificationManagementService(
        INotificationRepository notificationRepository,
        IEmailService emailService,
        IWhatsAppService whatsAppService,
        ISmsService smsService,
        IPushNotificationService pushService,
        ILogger<NotificationManagementService> logger)
    {
        _notificationRepository = notificationRepository;
        _emailService = emailService;
        _whatsAppService = whatsAppService;
        _smsService = smsService;
        _pushService = pushService;
        _logger = logger;
    }

    public async Task<NotificationDto> SendEmailNotificationAsync(SendEmailRequest request)
    {
        // Create notification record
        var notification = new Notification
        {
            Id = Guid.NewGuid(),
            RecipientId = request.RecipientId,
            RecipientType = request.RecipientType,
            NotificationType = request.NotificationType,
            Channel = "email",
            Subject = request.Subject,
            Body = request.Body,
            Data = request.Data != null ? JsonSerializer.Serialize(request.Data) : null,
            Status = "pending",
            Provider = "ses",
            CreatedAt = DateTime.UtcNow
        };

        await _notificationRepository.CreateAsync(notification);

        // Send email
        var (success, messageId, error) = await _emailService.SendEmailAsync(
            request.RecipientEmail,
            request.Subject,
            request.Body
        );

        // Update notification status
        if (success)
        {
            notification.Status = "sent";
            notification.SentAt = DateTime.UtcNow;
            notification.ProviderMessageId = messageId;
        }
        else
        {
            notification.Status = "failed";
            notification.FailedReason = error;
        }

        await _notificationRepository.UpdateAsync(notification);

        return MapToDto(notification);
    }

    public async Task<NotificationDto> SendWhatsAppNotificationAsync(SendWhatsAppRequest request)
    {
        var notification = new Notification
        {
            Id = Guid.NewGuid(),
            RecipientId = request.RecipientId,
            RecipientType = request.RecipientType,
            NotificationType = request.NotificationType,
            Channel = "whatsapp",
            Body = $"Template: {request.TemplateName}",
            Data = request.Parameters != null ? JsonSerializer.Serialize(request.Parameters) : null,
            Status = "pending",
            Provider = "whatsapp_business",
            CreatedAt = DateTime.UtcNow
        };

        await _notificationRepository.CreateAsync(notification);

        var (success, messageId, error) = await _whatsAppService.SendTemplateMessageAsync(
            request.RecipientPhone,
            request.TemplateName,
            request.Language,
            request.Parameters
        );

        if (success)
        {
            notification.Status = "sent";
            notification.SentAt = DateTime.UtcNow;
            notification.ProviderMessageId = messageId;
        }
        else
        {
            notification.Status = "failed";
            notification.FailedReason = error;
        }

        await _notificationRepository.UpdateAsync(notification);

        return MapToDto(notification);
    }

    public async Task<NotificationDto> SendSmsNotificationAsync(SendSmsRequest request)
    {
        var notification = new Notification
        {
            Id = Guid.NewGuid(),
            RecipientId = request.RecipientId,
            RecipientType = request.RecipientType,
            NotificationType = request.NotificationType,
            Channel = "sms",
            Body = request.Message,
            Status = "pending",
            Provider = "sns",
            CreatedAt = DateTime.UtcNow
        };

        await _notificationRepository.CreateAsync(notification);

        var (success, messageId, error) = await _smsService.SendSmsAsync(
            request.RecipientPhone,
            request.Message
        );

        if (success)
        {
            notification.Status = "sent";
            notification.SentAt = DateTime.UtcNow;
            notification.ProviderMessageId = messageId;
        }
        else
        {
            notification.Status = "failed";
            notification.FailedReason = error;
        }

        await _notificationRepository.UpdateAsync(notification);

        return MapToDto(notification);
    }

    public async Task<NotificationDto> SendPushNotificationAsync(SendPushRequest request)
    {
        var notification = new Notification
        {
            Id = Guid.NewGuid(),
            RecipientId = request.RecipientId,
            RecipientType = request.RecipientType,
            NotificationType = request.NotificationType,
            Channel = "push",
            Subject = request.Title,
            Body = request.Body,
            Data = request.Data != null ? JsonSerializer.Serialize(request.Data) : null,
            Status = "pending",
            Provider = "fcm",
            CreatedAt = DateTime.UtcNow
        };

        await _notificationRepository.CreateAsync(notification);

        var (success, messageId, error) = await _pushService.SendPushNotificationAsync(
            request.DeviceToken,
            request.Title,
            request.Body,
            request.Data
        );

        if (success)
        {
            notification.Status = "sent";
            notification.SentAt = DateTime.UtcNow;
            notification.ProviderMessageId = messageId;
        }
        else
        {
            notification.Status = "failed";
            notification.FailedReason = error;
        }

        await _notificationRepository.UpdateAsync(notification);

        return MapToDto(notification);
    }

    public async Task<NotificationDto?> GetNotificationByIdAsync(Guid id)
    {
        var notification = await _notificationRepository.GetByIdAsync(id);
        return notification != null ? MapToDto(notification) : null;
    }

    public async Task<(List<NotificationDto> Notifications, int TotalCount)> GetUserNotificationsAsync(
        Guid userId, int page, int pageSize)
    {
        var notifications = await _notificationRepository.GetByRecipientIdAsync(userId, page, pageSize);
        var totalCount = await _notificationRepository.CountByRecipientIdAsync(userId);

        var dtos = notifications.Select(MapToDto).ToList();
        return (dtos, totalCount);
    }

    private static NotificationDto MapToDto(Notification notification)
    {
        return new NotificationDto
        {
            Id = notification.Id,
            RecipientId = notification.RecipientId,
            RecipientType = notification.RecipientType,
            NotificationType = notification.NotificationType,
            Channel = notification.Channel,
            Subject = notification.Subject,
            Body = notification.Body,
            Data = notification.Data != null ? JsonSerializer.Deserialize<object>(notification.Data) : null,
            Status = notification.Status,
            SentAt = notification.SentAt,
            DeliveredAt = notification.DeliveredAt,
            FailedReason = notification.FailedReason,
            Provider = notification.Provider,
            CreatedAt = notification.CreatedAt
        };
    }
}
