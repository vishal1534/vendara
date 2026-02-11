using Amazon.SimpleNotificationService;
using Amazon.SimpleNotificationService.Model;
using NotificationService.Services.Interfaces;

namespace NotificationService.Services;

public class SmsService : ISmsService
{
    private readonly IAmazonSimpleNotificationService _snsClient;
    private readonly ILogger<SmsService> _logger;

    public SmsService(
        IAmazonSimpleNotificationService snsClient,
        ILogger<SmsService> logger)
    {
        _snsClient = snsClient;
        _logger = logger;
    }

    public async Task<(bool Success, string? MessageId, string? Error)> SendSmsAsync(
        string phoneNumber,
        string message)
    {
        try
        {
            // Format phone number to E.164 format (must start with +)
            var formattedPhone = phoneNumber.StartsWith("+") ? phoneNumber : $"+{phoneNumber}";

            var request = new PublishRequest
            {
                Message = message,
                PhoneNumber = formattedPhone,
                MessageAttributes = new Dictionary<string, MessageAttributeValue>
                {
                    {
                        "AWS.SNS.SMS.SMSType",
                        new MessageAttributeValue
                        {
                            DataType = "String",
                            StringValue = "Transactional" // Use Transactional for important messages
                        }
                    }
                }
            };

            var response = await _snsClient.PublishAsync(request);
            
            _logger.LogInformation("SMS sent successfully to {Phone}. MessageId: {MessageId}", 
                phoneNumber, response.MessageId);
            
            return (true, response.MessageId, null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send SMS to {Phone}", phoneNumber);
            return (false, null, ex.Message);
        }
    }
}
