using FluentValidation;
using IntegrationService.Models.Requests;

namespace IntegrationService.Models.Validators;

/// <summary>
/// Validator for SendWhatsAppTextRequest
/// </summary>
public class SendWhatsAppTextRequestValidator : AbstractValidator<SendWhatsAppTextRequest>
{
    public SendWhatsAppTextRequestValidator()
    {
        RuleFor(x => x.PhoneNumber)
            .NotEmpty().WithMessage("Phone number is required")
            .Matches(@"^\+?[1-9]\d{1,14}$").WithMessage("Phone number must be in E.164 format (e.g., +917906441952)")
            .MaximumLength(15).WithMessage("Phone number cannot exceed 15 characters");

        RuleFor(x => x.Message)
            .NotEmpty().WithMessage("Message is required")
            .MaximumLength(4096).WithMessage("Message cannot exceed 4096 characters");

        RuleFor(x => x.UserId)
            .MaximumLength(100).WithMessage("UserId cannot exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.UserId));

        RuleFor(x => x.UserType)
            .Must(BeValidUserType).WithMessage("UserType must be 'buyer', 'vendor', or 'admin'")
            .When(x => !string.IsNullOrEmpty(x.UserType));

        RuleFor(x => x.Context)
            .MaximumLength(200).WithMessage("Context cannot exceed 200 characters")
            .When(x => !string.IsNullOrEmpty(x.Context));

        RuleFor(x => x.RelatedEntityId)
            .MaximumLength(100).WithMessage("RelatedEntityId cannot exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.RelatedEntityId));

        RuleFor(x => x.RelatedEntityType)
            .Must(BeValidEntityType).WithMessage("RelatedEntityType must be 'order', 'payment', 'dispute', 'vendor', or 'buyer'")
            .When(x => !string.IsNullOrEmpty(x.RelatedEntityType));
    }

    private bool BeValidUserType(string? userType)
    {
        if (string.IsNullOrEmpty(userType)) return true;
        var validTypes = new[] { "buyer", "vendor", "admin" };
        return validTypes.Contains(userType.ToLowerInvariant());
    }

    private bool BeValidEntityType(string? entityType)
    {
        if (string.IsNullOrEmpty(entityType)) return true;
        var validTypes = new[] { "order", "payment", "dispute", "vendor", "buyer" };
        return validTypes.Contains(entityType.ToLowerInvariant());
    }
}

/// <summary>
/// Validator for SendWhatsAppTemplateRequest
/// </summary>
public class SendWhatsAppTemplateRequestValidator : AbstractValidator<SendWhatsAppTemplateRequest>
{
    public SendWhatsAppTemplateRequestValidator()
    {
        RuleFor(x => x.PhoneNumber)
            .NotEmpty().WithMessage("Phone number is required")
            .Matches(@"^\+?[1-9]\d{1,14}$").WithMessage("Phone number must be in E.164 format (e.g., +917906441952)")
            .MaximumLength(15).WithMessage("Phone number cannot exceed 15 characters");

        RuleFor(x => x.TemplateName)
            .NotEmpty().WithMessage("Template name is required")
            .MaximumLength(100).WithMessage("Template name cannot exceed 100 characters")
            .Matches(@"^[a-z0-9_]+$").WithMessage("Template name must contain only lowercase letters, numbers, and underscores");

        RuleFor(x => x.LanguageCode)
            .NotEmpty().WithMessage("Language code is required")
            .Length(2).WithMessage("Language code must be 2 characters (ISO 639-1 format)")
            .Matches(@"^[a-z]{2}$").WithMessage("Language code must be lowercase (e.g., 'en', 'hi', 'te')");

        RuleFor(x => x.Parameters)
            .Must(x => x == null || x.Count <= 10).WithMessage("Template cannot have more than 10 parameters")
            .When(x => x.Parameters != null);

        RuleForEach(x => x.Parameters)
            .NotEmpty().WithMessage("Template parameters cannot be empty")
            .MaximumLength(500).WithMessage("Each parameter cannot exceed 500 characters")
            .When(x => x.Parameters != null);

        RuleFor(x => x.UserId)
            .MaximumLength(100).WithMessage("UserId cannot exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.UserId));

        RuleFor(x => x.UserType)
            .Must(BeValidUserType).WithMessage("UserType must be 'buyer', 'vendor', or 'admin'")
            .When(x => !string.IsNullOrEmpty(x.UserType));

        RuleFor(x => x.Context)
            .MaximumLength(200).WithMessage("Context cannot exceed 200 characters")
            .When(x => !string.IsNullOrEmpty(x.Context));

        RuleFor(x => x.RelatedEntityId)
            .MaximumLength(100).WithMessage("RelatedEntityId cannot exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.RelatedEntityId));

        RuleFor(x => x.RelatedEntityType)
            .Must(BeValidEntityType).WithMessage("RelatedEntityType must be 'order', 'payment', 'dispute', 'vendor', or 'buyer'")
            .When(x => !string.IsNullOrEmpty(x.RelatedEntityType));
    }

    private bool BeValidUserType(string? userType)
    {
        if (string.IsNullOrEmpty(userType)) return true;
        var validTypes = new[] { "buyer", "vendor", "admin" };
        return validTypes.Contains(userType.ToLowerInvariant());
    }

    private bool BeValidEntityType(string? entityType)
    {
        if (string.IsNullOrEmpty(entityType)) return true;
        var validTypes = new[] { "order", "payment", "dispute", "vendor", "buyer" };
        return validTypes.Contains(entityType.ToLowerInvariant());
    }
}

/// <summary>
/// Validator for SendWhatsAppMediaRequest
/// </summary>
public class SendWhatsAppMediaRequestValidator : AbstractValidator<SendWhatsAppMediaRequest>
{
    public SendWhatsAppMediaRequestValidator()
    {
        RuleFor(x => x.PhoneNumber)
            .NotEmpty().WithMessage("Phone number is required")
            .Matches(@"^\+?[1-9]\d{1,14}$").WithMessage("Phone number must be in E.164 format (e.g., +917906441952)")
            .MaximumLength(15).WithMessage("Phone number cannot exceed 15 characters");

        RuleFor(x => x.MediaUrl)
            .NotEmpty().WithMessage("Media URL is required")
            .Must(BeValidUrl).WithMessage("Media URL must be a valid HTTPS URL")
            .MaximumLength(2048).WithMessage("Media URL cannot exceed 2048 characters");

        RuleFor(x => x.MediaType)
            .NotEmpty().WithMessage("Media type is required")
            .Must(BeValidMediaType).WithMessage("Media type must be 'image', 'document', 'video', or 'audio'");

        RuleFor(x => x.Caption)
            .MaximumLength(1024).WithMessage("Caption cannot exceed 1024 characters")
            .When(x => !string.IsNullOrEmpty(x.Caption));

        RuleFor(x => x.UserId)
            .MaximumLength(100).WithMessage("UserId cannot exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.UserId));

        RuleFor(x => x.UserType)
            .Must(BeValidUserType).WithMessage("UserType must be 'buyer', 'vendor', or 'admin'")
            .When(x => !string.IsNullOrEmpty(x.UserType));

        RuleFor(x => x.Context)
            .MaximumLength(200).WithMessage("Context cannot exceed 200 characters")
            .When(x => !string.IsNullOrEmpty(x.Context));

        RuleFor(x => x.RelatedEntityId)
            .MaximumLength(100).WithMessage("RelatedEntityId cannot exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.RelatedEntityId));

        RuleFor(x => x.RelatedEntityType)
            .Must(BeValidEntityType).WithMessage("RelatedEntityType must be 'order', 'payment', 'dispute', 'vendor', or 'buyer'")
            .When(x => !string.IsNullOrEmpty(x.RelatedEntityType));
    }

    private bool BeValidUrl(string url)
    {
        return Uri.TryCreate(url, UriKind.Absolute, out var uriResult)
               && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
    }

    private bool BeValidMediaType(string mediaType)
    {
        var validTypes = new[] { "image", "document", "video", "audio" };
        return validTypes.Contains(mediaType.ToLowerInvariant());
    }

    private bool BeValidUserType(string? userType)
    {
        if (string.IsNullOrEmpty(userType)) return true;
        var validTypes = new[] { "buyer", "vendor", "admin" };
        return validTypes.Contains(userType.ToLowerInvariant());
    }

    private bool BeValidEntityType(string? entityType)
    {
        if (string.IsNullOrEmpty(entityType)) return true;
        var validTypes = new[] { "order", "payment", "dispute", "vendor", "buyer" };
        return validTypes.Contains(entityType.ToLowerInvariant());
    }
}
