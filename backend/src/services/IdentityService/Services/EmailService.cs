namespace IdentityService.Services;

public interface IEmailService
{
    Task SendVerificationEmailAsync(string email, string verificationLink);
    Task SendPasswordResetEmailAsync(string email, string resetLink);
    Task SendWelcomeEmailAsync(string email, string userName);
    Task SendOtpEmailAsync(string email, string otpCode);
}

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendVerificationEmailAsync(string email, string verificationLink)
    {
        // TODO: Implement email sending with SendGrid/AWS SES/SMTP
        // For now, just log the email
        _logger.LogInformation("Verification email would be sent to {Email} with link: {Link}", email, verificationLink);
        
        await Task.CompletedTask;
        
        // Production implementation example with SendGrid:
        /*
        var apiKey = _configuration["SendGrid:ApiKey"];
        var client = new SendGridClient(apiKey);
        var from = new EmailAddress("noreply@realserv.com", "RealServ");
        var to = new EmailAddress(email);
        var subject = "Verify Your Email - RealServ";
        var htmlContent = $@"
            <h1>Welcome to RealServ!</h1>
            <p>Please verify your email address by clicking the link below:</p>
            <a href='{verificationLink}'>Verify Email</a>
            <p>If you didn't create this account, please ignore this email.</p>
        ";
        
        var msg = MailHelper.CreateSingleEmail(from, to, subject, "", htmlContent);
        await client.SendEmailAsync(msg);
        */
    }

    public async Task SendPasswordResetEmailAsync(string email, string resetLink)
    {
        _logger.LogInformation("Password reset email would be sent to {Email} with link: {Link}", email, resetLink);
        await Task.CompletedTask;
    }

    public async Task SendWelcomeEmailAsync(string email, string userName)
    {
        _logger.LogInformation("Welcome email would be sent to {Email} for user: {UserName}", email, userName);
        await Task.CompletedTask;
    }

    public async Task SendOtpEmailAsync(string email, string otpCode)
    {
        _logger.LogInformation("OTP email would be sent to {Email} with code: {OtpCode}", email, otpCode);
        await Task.CompletedTask;
    }
}
