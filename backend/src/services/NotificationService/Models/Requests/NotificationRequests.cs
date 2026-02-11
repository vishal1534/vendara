namespace NotificationService.Models.Requests;

public class SendEmailRequest
{
    public Guid RecipientId { get; set; }
    public string RecipientType { get; set; } = string.Empty; // 'buyer', 'vendor', 'admin'
    public string RecipientEmail { get; set; } = string.Empty;
    public string NotificationType { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public Dictionary<string, object>? Data { get; set; }
}

public class SendWhatsAppRequest
{
    public Guid RecipientId { get; set; }
    public string RecipientType { get; set; } = string.Empty;
    public string RecipientPhone { get; set; } = string.Empty;
    public string NotificationType { get; set; } = string.Empty;
    public string TemplateName { get; set; } = string.Empty;
    public string Language { get; set; } = "en";
    public Dictionary<string, string>? Parameters { get; set; }
}

public class SendSmsRequest
{
    public Guid RecipientId { get; set; }
    public string RecipientType { get; set; } = string.Empty;
    public string RecipientPhone { get; set; } = string.Empty;
    public string NotificationType { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

public class SendPushRequest
{
    public Guid RecipientId { get; set; }
    public string RecipientType { get; set; } = string.Empty;
    public string DeviceToken { get; set; } = string.Empty;
    public string NotificationType { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public Dictionary<string, string>? Data { get; set; }
}

public class CreateTemplateRequest
{
    public string TemplateName { get; set; } = string.Empty;
    public string TemplateType { get; set; } = string.Empty; // 'email', 'whatsapp', 'sms', 'push'
    public string? Subject { get; set; }
    public string Body { get; set; } = string.Empty;
    public List<string>? Variables { get; set; }
    public string? WhatsAppTemplateId { get; set; }
    public string? WhatsAppLanguage { get; set; }
}

public class UpdateTemplateRequest
{
    public string? Subject { get; set; }
    public string? Body { get; set; }
    public List<string>? Variables { get; set; }
    public bool? IsActive { get; set; }
}

public class UpdatePreferencesRequest
{
    public bool? EmailEnabled { get; set; }
    public bool? EmailOrderUpdates { get; set; }
    public bool? EmailPaymentUpdates { get; set; }
    public bool? EmailPromotions { get; set; }
    public bool? WhatsAppEnabled { get; set; }
    public bool? WhatsAppOrderUpdates { get; set; }
    public bool? WhatsAppPaymentUpdates { get; set; }
    public bool? WhatsAppPromotions { get; set; }
    public bool? SmsEnabled { get; set; }
    public bool? SmsOrderUpdates { get; set; }
    public bool? PushEnabled { get; set; }
    public bool? PushOrderUpdates { get; set; }
    public bool? PushPaymentUpdates { get; set; }
}
