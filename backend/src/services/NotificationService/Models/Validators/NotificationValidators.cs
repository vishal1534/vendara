using FluentValidation;
using NotificationService.Models.Requests;

namespace NotificationService.Models.Validators;

public class SendEmailRequestValidator : AbstractValidator<SendEmailRequest>
{
    public SendEmailRequestValidator()
    {
        RuleFor(x => x.RecipientId)
            .NotEmpty()
            .WithMessage("Recipient ID is required");

        RuleFor(x => x.RecipientType)
            .NotEmpty()
            .Must(x => new[] { "buyer", "vendor", "admin" }.Contains(x))
            .WithMessage("Recipient type must be 'buyer', 'vendor', or 'admin'");

        RuleFor(x => x.RecipientEmail)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(255)
            .WithMessage("Valid email address is required (max 255 characters)");

        RuleFor(x => x.NotificationType)
            .NotEmpty()
            .MaximumLength(50)
            .WithMessage("Notification type is required (max 50 characters)");

        RuleFor(x => x.Subject)
            .NotEmpty()
            .MaximumLength(255)
            .WithMessage("Subject is required (max 255 characters)");

        RuleFor(x => x.Body)
            .NotEmpty()
            .MaximumLength(10000)
            .WithMessage("Body is required (max 10,000 characters)");
    }
}

public class SendWhatsAppRequestValidator : AbstractValidator<SendWhatsAppRequest>
{
    public SendWhatsAppRequestValidator()
    {
        RuleFor(x => x.RecipientId)
            .NotEmpty()
            .WithMessage("Recipient ID is required");

        RuleFor(x => x.RecipientType)
            .NotEmpty()
            .Must(x => new[] { "buyer", "vendor", "admin" }.Contains(x))
            .WithMessage("Recipient type must be 'buyer', 'vendor', or 'admin'");

        RuleFor(x => x.RecipientPhone)
            .NotEmpty()
            .Matches(@"^\+?[1-9]\d{1,14}$")
            .WithMessage("Valid phone number is required in E.164 format");

        RuleFor(x => x.NotificationType)
            .NotEmpty()
            .MaximumLength(50)
            .WithMessage("Notification type is required");

        RuleFor(x => x.TemplateName)
            .NotEmpty()
            .MaximumLength(100)
            .WithMessage("Template name is required");

        RuleFor(x => x.Language)
            .NotEmpty()
            .Must(x => new[] { "en", "hi" }.Contains(x))
            .WithMessage("Language must be 'en' or 'hi'");
    }
}

public class SendSmsRequestValidator : AbstractValidator<SendSmsRequest>
{
    public SendSmsRequestValidator()
    {
        RuleFor(x => x.RecipientId)
            .NotEmpty()
            .WithMessage("Recipient ID is required");

        RuleFor(x => x.RecipientType)
            .NotEmpty()
            .Must(x => new[] { "buyer", "vendor", "admin" }.Contains(x))
            .WithMessage("Recipient type must be 'buyer', 'vendor', or 'admin'");

        RuleFor(x => x.RecipientPhone)
            .NotEmpty()
            .Matches(@"^\+?[1-9]\d{1,14}$")
            .WithMessage("Valid phone number is required in E.164 format");

        RuleFor(x => x.NotificationType)
            .NotEmpty()
            .MaximumLength(50)
            .WithMessage("Notification type is required");

        RuleFor(x => x.Message)
            .NotEmpty()
            .MaximumLength(160)
            .WithMessage("Message is required (max 160 characters for SMS)");
    }
}

public class SendPushRequestValidator : AbstractValidator<SendPushRequest>
{
    public SendPushRequestValidator()
    {
        RuleFor(x => x.RecipientId)
            .NotEmpty()
            .WithMessage("Recipient ID is required");

        RuleFor(x => x.RecipientType)
            .NotEmpty()
            .Must(x => new[] { "buyer", "vendor", "admin" }.Contains(x))
            .WithMessage("Recipient type must be 'buyer', 'vendor', or 'admin'");

        RuleFor(x => x.DeviceToken)
            .NotEmpty()
            .WithMessage("Device token is required");

        RuleFor(x => x.NotificationType)
            .NotEmpty()
            .MaximumLength(50)
            .WithMessage("Notification type is required");

        RuleFor(x => x.Title)
            .NotEmpty()
            .MaximumLength(100)
            .WithMessage("Title is required (max 100 characters)");

        RuleFor(x => x.Body)
            .NotEmpty()
            .MaximumLength(500)
            .WithMessage("Body is required (max 500 characters)");
    }
}

public class CreateTemplateRequestValidator : AbstractValidator<CreateTemplateRequest>
{
    public CreateTemplateRequestValidator()
    {
        RuleFor(x => x.TemplateName)
            .NotEmpty()
            .MaximumLength(100)
            .Matches(@"^[a-z0-9_]+$")
            .WithMessage("Template name is required (lowercase, numbers, underscores only, max 100 chars)");

        RuleFor(x => x.TemplateType)
            .NotEmpty()
            .Must(x => new[] { "email", "whatsapp", "sms", "push" }.Contains(x))
            .WithMessage("Template type must be 'email', 'whatsapp', 'sms', or 'push'");

        RuleFor(x => x.Body)
            .NotEmpty()
            .MaximumLength(10000)
            .WithMessage("Body is required (max 10,000 characters)");

        When(x => x.TemplateType == "email", () =>
        {
            RuleFor(x => x.Subject)
                .NotEmpty()
                .MaximumLength(255)
                .WithMessage("Subject is required for email templates");
        });

        When(x => x.TemplateType == "whatsapp", () =>
        {
            RuleFor(x => x.WhatsAppTemplateId)
                .NotEmpty()
                .WithMessage("WhatsApp template ID is required for WhatsApp templates");

            RuleFor(x => x.WhatsAppLanguage)
                .NotEmpty()
                .Must(x => new[] { "en", "hi" }.Contains(x!))
                .WithMessage("WhatsApp language must be 'en' or 'hi'");
        });
    }
}

public class UpdatePreferencesRequestValidator : AbstractValidator<UpdatePreferencesRequest>
{
    public UpdatePreferencesRequestValidator()
    {
        // All fields are optional, so just validate that at least one field is provided
        RuleFor(x => x)
            .Must(x => 
                x.EmailEnabled.HasValue ||
                x.EmailOrderUpdates.HasValue ||
                x.EmailPaymentUpdates.HasValue ||
                x.EmailPromotions.HasValue ||
                x.WhatsAppEnabled.HasValue ||
                x.WhatsAppOrderUpdates.HasValue ||
                x.WhatsAppPaymentUpdates.HasValue ||
                x.WhatsAppPromotions.HasValue ||
                x.SmsEnabled.HasValue ||
                x.SmsOrderUpdates.HasValue ||
                x.PushEnabled.HasValue ||
                x.PushOrderUpdates.HasValue ||
                x.PushPaymentUpdates.HasValue)
            .WithMessage("At least one preference field must be provided");
    }
}
