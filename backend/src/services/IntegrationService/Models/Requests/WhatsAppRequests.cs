namespace IntegrationService.Models.Requests;

/// <summary>
/// Request to send a WhatsApp text message
/// </summary>
public class SendWhatsAppTextRequest
{
    public string PhoneNumber { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? UserId { get; set; }
    public string? UserType { get; set; }
    public string? Context { get; set; }
    public string? RelatedEntityId { get; set; }
    public string? RelatedEntityType { get; set; }
}

/// <summary>
/// Request to send a WhatsApp template message
/// </summary>
public class SendWhatsAppTemplateRequest
{
    public string PhoneNumber { get; set; } = string.Empty;
    public string TemplateName { get; set; } = string.Empty;
    public string LanguageCode { get; set; } = "en";
    public List<string>? Parameters { get; set; }
    public string? UserId { get; set; }
    public string? UserType { get; set; }
    public string? Context { get; set; }
    public string? RelatedEntityId { get; set; }
    public string? RelatedEntityType { get; set; }
}

/// <summary>
/// Request to send a WhatsApp media message (image, document, etc.)
/// </summary>
public class SendWhatsAppMediaRequest
{
    public string PhoneNumber { get; set; } = string.Empty;
    public string MediaUrl { get; set; } = string.Empty;
    public string MediaType { get; set; } = string.Empty; // "image", "document", "video", "audio"
    public string? Caption { get; set; }
    public string? UserId { get; set; }
    public string? UserType { get; set; }
    public string? Context { get; set; }
    public string? RelatedEntityId { get; set; }
    public string? RelatedEntityType { get; set; }
}

/// <summary>
/// Webhook payload from WhatsApp
/// </summary>
public class WhatsAppWebhookPayload
{
    public string Object { get; set; } = string.Empty;
    public List<WhatsAppWebhookEntry>? Entry { get; set; }
}

public class WhatsAppWebhookEntry
{
    public string Id { get; set; } = string.Empty;
    public List<WhatsAppWebhookChange>? Changes { get; set; }
}

public class WhatsAppWebhookChange
{
    public WhatsAppWebhookValue? Value { get; set; }
    public string Field { get; set; } = string.Empty;
}

public class WhatsAppWebhookValue
{
    public string MessagingProduct { get; set; } = string.Empty;
    public WhatsAppWebhookMetadata? Metadata { get; set; }
    public List<WhatsAppWebhookContact>? Contacts { get; set; }
    public List<WhatsAppWebhookMessage>? Messages { get; set; }
    public List<WhatsAppWebhookStatus>? Statuses { get; set; }
}

public class WhatsAppWebhookMetadata
{
    public string DisplayPhoneNumber { get; set; } = string.Empty;
    public string PhoneNumberId { get; set; } = string.Empty;
}

public class WhatsAppWebhookContact
{
    public WhatsAppWebhookProfile? Profile { get; set; }
    public string WaId { get; set; } = string.Empty;
}

public class WhatsAppWebhookProfile
{
    public string Name { get; set; } = string.Empty;
}

public class WhatsAppWebhookMessage
{
    public string From { get; set; } = string.Empty;
    public string Id { get; set; } = string.Empty;
    public string Timestamp { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public WhatsAppWebhookText? Text { get; set; }
    public WhatsAppWebhookImage? Image { get; set; }
    public WhatsAppWebhookDocument? Document { get; set; }
}

public class WhatsAppWebhookText
{
    public string Body { get; set; } = string.Empty;
}

public class WhatsAppWebhookImage
{
    public string MimeType { get; set; } = string.Empty;
    public string Sha256 { get; set; } = string.Empty;
    public string Id { get; set; } = string.Empty;
}

public class WhatsAppWebhookDocument
{
    public string Filename { get; set; } = string.Empty;
    public string MimeType { get; set; } = string.Empty;
    public string Sha256 { get; set; } = string.Empty;
    public string Id { get; set; } = string.Empty;
}

public class WhatsAppWebhookStatus
{
    public string Id { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Timestamp { get; set; } = string.Empty;
    public string RecipientId { get; set; } = string.Empty;
}
