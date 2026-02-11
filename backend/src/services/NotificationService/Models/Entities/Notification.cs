namespace NotificationService.Models.Entities;

/// <summary>
/// Represents a notification sent to a user
/// </summary>
public class Notification
{
    public Guid Id { get; set; }
    
    // Recipient
    public Guid RecipientId { get; set; }
    public string RecipientType { get; set; } = string.Empty; // 'buyer', 'vendor', 'admin'
    
    // Notification details
    public string NotificationType { get; set; } = string.Empty; // 'order_created', 'order_confirmed', etc.
    public string Channel { get; set; } = string.Empty; // 'email', 'whatsapp', 'sms', 'push'
    
    // Content
    public string? Subject { get; set; }
    public string Body { get; set; } = string.Empty;
    public string? Data { get; set; } // JSON string for additional data
    
    // Delivery
    public string Status { get; set; } = "pending"; // 'pending', 'sent', 'delivered', 'failed'
    public DateTime? SentAt { get; set; }
    public DateTime? DeliveredAt { get; set; }
    public string? FailedReason { get; set; }
    
    // External provider
    public string? Provider { get; set; } // 'ses', 'whatsapp_business', 'twilio', 'fcm'
    public string? ProviderMessageId { get; set; }
    
    public DateTime CreatedAt { get; set; }
}
