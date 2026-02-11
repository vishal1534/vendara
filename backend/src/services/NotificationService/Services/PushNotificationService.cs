using FirebaseAdmin.Messaging;
using NotificationService.Services.Interfaces;

namespace NotificationService.Services;

public class PushNotificationService : IPushNotificationService
{
    private readonly ILogger<PushNotificationService> _logger;

    public PushNotificationService(ILogger<PushNotificationService> logger)
    {
        _logger = logger;
    }

    public async Task<(bool Success, string? MessageId, string? Error)> SendPushNotificationAsync(
        string deviceToken,
        string title,
        string body,
        Dictionary<string, string>? data = null)
    {
        try
        {
            var message = new Message
            {
                Token = deviceToken,
                Notification = new Notification
                {
                    Title = title,
                    Body = body
                },
                Data = data,
                Android = new AndroidConfig
                {
                    Priority = Priority.High,
                    Notification = new AndroidNotification
                    {
                        Sound = "default",
                        ClickAction = "FLUTTER_NOTIFICATION_CLICK"
                    }
                },
                Apns = new ApnsConfig
                {
                    Aps = new Aps
                    {
                        Sound = "default",
                        Badge = 1
                    }
                }
            };

            var response = await FirebaseMessaging.DefaultInstance.SendAsync(message);
            
            _logger.LogInformation("Push notification sent successfully. MessageId: {MessageId}", response);
            
            return (true, response, null);
        }
        catch (FirebaseMessagingException ex)
        {
            _logger.LogError(ex, "Firebase error sending push notification. Code: {Code}", ex.MessagingErrorCode);
            return (false, null, $"Firebase error: {ex.MessagingErrorCode}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send push notification");
            return (false, null, ex.Message);
        }
    }
}
