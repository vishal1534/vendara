using Microsoft.AspNetCore.Mvc;
using NotificationService.Models.Requests;
using NotificationService.Models.Responses;
using NotificationService.Services.Interfaces;

namespace NotificationService.Controllers;

[ApiController]
[Route("api/v1/notifications")]
public class NotificationController : ControllerBase
{
    private readonly INotificationService _notificationService;
    private readonly ILogger<NotificationController> _logger;

    public NotificationController(
        INotificationService notificationService,
        ILogger<NotificationController> logger)
    {
        _notificationService = notificationService;
        _logger = logger;
    }

    /// <summary>
    /// Send an email notification
    /// </summary>
    [HttpPost("email")]
    public async Task<ActionResult<SendNotificationResponse>> SendEmail([FromBody] SendEmailRequest request)
    {
        try
        {
            var notification = await _notificationService.SendEmailNotificationAsync(request);
            
            return Ok(new SendNotificationResponse
            {
                NotificationId = notification.Id,
                Status = notification.Status,
                ProviderMessageId = notification.Provider,
                Message = "Email notification queued successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending email notification");
            return StatusCode(500, new ErrorResponse
            {
                Error = "Failed to send email notification",
                Details = ex.Message
            });
        }
    }

    /// <summary>
    /// Send a WhatsApp notification
    /// </summary>
    [HttpPost("whatsapp")]
    public async Task<ActionResult<SendNotificationResponse>> SendWhatsApp([FromBody] SendWhatsAppRequest request)
    {
        try
        {
            var notification = await _notificationService.SendWhatsAppNotificationAsync(request);
            
            return Ok(new SendNotificationResponse
            {
                NotificationId = notification.Id,
                Status = notification.Status,
                ProviderMessageId = notification.Provider,
                Message = "WhatsApp notification sent successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending WhatsApp notification");
            return StatusCode(500, new ErrorResponse
            {
                Error = "Failed to send WhatsApp notification",
                Details = ex.Message
            });
        }
    }

    /// <summary>
    /// Send an SMS notification
    /// </summary>
    [HttpPost("sms")]
    public async Task<ActionResult<SendNotificationResponse>> SendSms([FromBody] SendSmsRequest request)
    {
        try
        {
            var notification = await _notificationService.SendSmsNotificationAsync(request);
            
            return Ok(new SendNotificationResponse
            {
                NotificationId = notification.Id,
                Status = notification.Status,
                ProviderMessageId = notification.Provider,
                Message = "SMS notification sent successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending SMS notification");
            return StatusCode(500, new ErrorResponse
            {
                Error = "Failed to send SMS notification",
                Details = ex.Message
            });
        }
    }

    /// <summary>
    /// Send a push notification
    /// </summary>
    [HttpPost("push")]
    public async Task<ActionResult<SendNotificationResponse>> SendPush([FromBody] SendPushRequest request)
    {
        try
        {
            var notification = await _notificationService.SendPushNotificationAsync(request);
            
            return Ok(new SendNotificationResponse
            {
                NotificationId = notification.Id,
                Status = notification.Status,
                ProviderMessageId = notification.Provider,
                Message = "Push notification sent successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending push notification");
            return StatusCode(500, new ErrorResponse
            {
                Error = "Failed to send push notification",
                Details = ex.Message
            });
        }
    }

    /// <summary>
    /// Get notification by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetNotificationById(Guid id)
    {
        try
        {
            var notification = await _notificationService.GetNotificationByIdAsync(id);
            
            if (notification == null)
            {
                return NotFound(new ErrorResponse { Error = "Notification not found" });
            }

            return Ok(notification);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving notification {NotificationId}", id);
            return StatusCode(500, new ErrorResponse
            {
                Error = "Failed to retrieve notification",
                Details = ex.Message
            });
        }
    }

    /// <summary>
    /// Get user notification history
    /// </summary>
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<NotificationHistoryResponse>> GetUserNotifications(
        Guid userId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        try
        {
            var (notifications, totalCount) = await _notificationService.GetUserNotificationsAsync(userId, page, pageSize);
            
            return Ok(new NotificationHistoryResponse
            {
                Notifications = notifications,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving notifications for user {UserId}", userId);
            return StatusCode(500, new ErrorResponse
            {
                Error = "Failed to retrieve user notifications",
                Details = ex.Message
            });
        }
    }
}
