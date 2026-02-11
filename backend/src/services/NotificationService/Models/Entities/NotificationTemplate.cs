namespace NotificationService.Models.Entities;

/// <summary>
/// Represents a reusable notification template
/// </summary>
public class NotificationTemplate
{
    public Guid Id { get; set; }
    public string TemplateName { get; set; } = string.Empty;
    public string TemplateType { get; set; } = string.Empty; // 'email', 'whatsapp', 'sms', 'push'
    
    // Template content
    public string? Subject { get; set; } // For email
    public string Body { get; set; } = string.Empty;
    public string? Variables { get; set; } // JSON string for template variables
    
    // WhatsApp specific
    public string? WhatsAppTemplateId { get; set; } // WhatsApp approved template ID
    public string? WhatsAppLanguage { get; set; } // 'en', 'hi'
    
    // Status
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
