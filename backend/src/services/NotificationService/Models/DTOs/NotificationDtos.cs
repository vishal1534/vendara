namespace NotificationService.Models.DTOs;

public class NotificationDto
{
    public Guid Id { get; set; }
    public Guid RecipientId { get; set; }
    public string RecipientType { get; set; } = string.Empty;
    public string NotificationType { get; set; } = string.Empty;
    public string Channel { get; set; } = string.Empty;
    public string? Subject { get; set; }
    public string Body { get; set; } = string.Empty;
    public object? Data { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime? SentAt { get; set; }
    public DateTime? DeliveredAt { get; set; }
    public string? FailedReason { get; set; }
    public string? Provider { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class NotificationTemplateDto
{
    public Guid Id { get; set; }
    public string TemplateName { get; set; } = string.Empty;
    public string TemplateType { get; set; } = string.Empty;
    public string? Subject { get; set; }
    public string Body { get; set; } = string.Empty;
    public List<string>? Variables { get; set; }
    public string? WhatsAppTemplateId { get; set; }
    public string? WhatsAppLanguage { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class UserNotificationPreferenceDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public bool EmailEnabled { get; set; }
    public bool EmailOrderUpdates { get; set; }
    public bool EmailPaymentUpdates { get; set; }
    public bool EmailPromotions { get; set; }
    public bool WhatsAppEnabled { get; set; }
    public bool WhatsAppOrderUpdates { get; set; }
    public bool WhatsAppPaymentUpdates { get; set; }
    public bool WhatsAppPromotions { get; set; }
    public bool SmsEnabled { get; set; }
    public bool SmsOrderUpdates { get; set; }
    public bool PushEnabled { get; set; }
    public bool PushOrderUpdates { get; set; }
    public bool PushPaymentUpdates { get; set; }
    public DateTime UpdatedAt { get; set; }
}
