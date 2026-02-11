namespace NotificationService.Models.Entities;

/// <summary>
/// Represents user notification preferences
/// </summary>
public class UserNotificationPreference
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    
    // Email preferences
    public bool EmailEnabled { get; set; } = true;
    public bool EmailOrderUpdates { get; set; } = true;
    public bool EmailPaymentUpdates { get; set; } = true;
    public bool EmailPromotions { get; set; } = false;
    
    // WhatsApp preferences
    public bool WhatsAppEnabled { get; set; } = true;
    public bool WhatsAppOrderUpdates { get; set; } = true;
    public bool WhatsAppPaymentUpdates { get; set; } = true;
    public bool WhatsAppPromotions { get; set; } = false;
    
    // SMS preferences
    public bool SmsEnabled { get; set; } = false;
    public bool SmsOrderUpdates { get; set; } = false;
    
    // Push preferences
    public bool PushEnabled { get; set; } = true;
    public bool PushOrderUpdates { get; set; } = true;
    public bool PushPaymentUpdates { get; set; } = true;
    
    public DateTime UpdatedAt { get; set; }
}
