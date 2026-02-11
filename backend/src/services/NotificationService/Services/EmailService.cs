using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;
using NotificationService.Services.Interfaces;

namespace NotificationService.Services;

public class EmailService : IEmailService
{
    private readonly IAmazonSimpleEmailService _sesClient;
    private readonly ILogger<EmailService> _logger;
    private readonly string _fromEmail;

    public EmailService(
        IAmazonSimpleEmailService sesClient,
        IConfiguration configuration,
        ILogger<EmailService> logger)
    {
        _sesClient = sesClient;
        _logger = logger;
        _fromEmail = configuration["AWS:SES:FromEmail"] ?? "noreply@realserv.in";
    }

    public async Task<(bool Success, string? MessageId, string? Error)> SendEmailAsync(
        string toEmail,
        string subject,
        string body,
        string? htmlBody = null)
    {
        try
        {
            var bodyContent = new Body();
            
            if (!string.IsNullOrEmpty(htmlBody))
            {
                bodyContent.Html = new Content(htmlBody);
                bodyContent.Text = new Content(body);
            }
            else
            {
                bodyContent.Text = new Content(body);
            }

            var sendRequest = new SendEmailRequest
            {
                Source = _fromEmail,
                Destination = new Destination
                {
                    ToAddresses = new List<string> { toEmail }
                },
                Message = new Message
                {
                    Subject = new Content(subject),
                    Body = bodyContent
                }
            };

            var response = await _sesClient.SendEmailAsync(sendRequest);
            
            _logger.LogInformation("Email sent successfully to {Email}. MessageId: {MessageId}", 
                toEmail, response.MessageId);
            
            return (true, response.MessageId, null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {Email}", toEmail);
            return (false, null, ex.Message);
        }
    }
}
