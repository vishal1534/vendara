using CatalogService.Models.DTOs;
using CatalogService.Models.Entities;
using FluentValidation;

namespace CatalogService.Validators;

/// <summary>
/// Validator for CreateCategoryRequest
/// </summary>
public class CreateCategoryRequestValidator : AbstractValidator<CreateCategoryRequest>
{
    public CreateCategoryRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Category name is required")
            .MaximumLength(100)
            .WithMessage("Category name cannot exceed 100 characters")
            .Matches(@"^[a-zA-Z0-9\s\-\&]+$")
            .WithMessage("Category name can only contain letters, numbers, spaces, hyphens, and ampersands");
        
        RuleFor(x => x.Key)
            .MaximumLength(50)
            .WithMessage("Category key cannot exceed 50 characters")
            .Matches(@"^[a-z0-9\-]+$")
            .WithMessage("Category key can only contain lowercase letters, numbers, and hyphens")
            .When(x => !string.IsNullOrEmpty(x.Key));

        RuleFor(x => x.Type)
            .IsInEnum()
            .WithMessage("Category type must be a valid value (Material or Labor)");

        RuleFor(x => x.Description)
            .MaximumLength(500)
            .WithMessage("Description cannot exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.IconUrl)
            .Must(BeValidUrl)
            .WithMessage("Icon URL must be a valid URL")
            .When(x => !string.IsNullOrEmpty(x.IconUrl));

        RuleFor(x => x.DisplayOrder)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Display order must be 0 or greater");
    }

    private bool BeValidUrl(string? url)
    {
        if (string.IsNullOrEmpty(url))
            return true;

        return Uri.TryCreate(url, UriKind.Absolute, out var uriResult)
            && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
    }
}

/// <summary>
/// Validator for UpdateCategoryRequest
/// </summary>
public class UpdateCategoryRequestValidator : AbstractValidator<UpdateCategoryRequest>
{
    public UpdateCategoryRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Category name cannot be empty if provided")
            .MaximumLength(100)
            .WithMessage("Category name cannot exceed 100 characters")
            .Matches(@"^[a-zA-Z0-9\s\-\&]+$")
            .WithMessage("Category name can only contain letters, numbers, spaces, hyphens, and ampersands")
            .When(x => x.Name != null);
        
        RuleFor(x => x.Key)
            .NotEmpty()
            .WithMessage("Category key cannot be empty if provided")
            .MaximumLength(50)
            .WithMessage("Category key cannot exceed 50 characters")
            .Matches(@"^[a-z0-9\-]+$")
            .WithMessage("Category key can only contain lowercase letters, numbers, and hyphens")
            .When(x => x.Key != null);

        RuleFor(x => x.Description)
            .MaximumLength(500)
            .WithMessage("Description cannot exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.IconUrl)
            .Must(BeValidUrl)
            .WithMessage("Icon URL must be a valid URL")
            .When(x => !string.IsNullOrEmpty(x.IconUrl));

        RuleFor(x => x.DisplayOrder)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Display order must be 0 or greater")
            .When(x => x.DisplayOrder.HasValue);
    }

    private bool BeValidUrl(string? url)
    {
        if (string.IsNullOrEmpty(url))
            return true;

        return Uri.TryCreate(url, UriKind.Absolute, out var uriResult)
            && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
    }
}