using CatalogService.Models.DTOs;
using CatalogService.Models.Entities;
using FluentValidation;

namespace CatalogService.Validators;

/// <summary>
/// Validator for CreateLaborCategoryRequest
/// </summary>
public class CreateLaborCategoryRequestValidator : AbstractValidator<CreateLaborCategoryRequest>
{
    public CreateLaborCategoryRequestValidator()
    {
        RuleFor(x => x.CategoryId)
            .NotEmpty()
            .WithMessage("Category ID is required");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Labor category name is required")
            .MaximumLength(200)
            .WithMessage("Labor category name cannot exceed 200 characters")
            .Matches(@"^[a-zA-Z0-9\s\-\(\)]+$")
            .WithMessage("Labor category name can only contain letters, numbers, spaces, hyphens, and parentheses");

        RuleFor(x => x.Description)
            .MaximumLength(1000)
            .WithMessage("Description cannot exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.BaseHourlyRate)
            .GreaterThan(0)
            .WithMessage("Base hourly rate must be greater than 0")
            .LessThanOrEqualTo(10000)
            .WithMessage("Base hourly rate cannot exceed ₹10,000 per hour");

        RuleFor(x => x.BaseDailyRate)
            .GreaterThan(0)
            .WithMessage("Base daily rate must be greater than 0")
            .LessThanOrEqualTo(50000)
            .WithMessage("Base daily rate cannot exceed ₹50,000 per day")
            .Must((request, dailyRate) => dailyRate >= request.BaseHourlyRate * 4)
            .WithMessage("Daily rate should be at least 4x the hourly rate");

        RuleFor(x => x.SkillLevel)
            .IsInEnum()
            .WithMessage("Skill level must be a valid value (Helper, SemiSkilled, Skilled, HighlySkilled, Expert)");

        RuleFor(x => x.IconUrl)
            .Must(BeValidUrl)
            .WithMessage("Icon URL must be a valid URL")
            .When(x => !string.IsNullOrEmpty(x.IconUrl));

        RuleFor(x => x.DisplayOrder)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Display order must be 0 or greater");

        RuleFor(x => x.Tags)
            .Must(tags => tags.Count <= 10)
            .WithMessage("Cannot have more than 10 tags")
            .Must(tags => tags.All(t => t.Length <= 50))
            .WithMessage("Each tag cannot exceed 50 characters")
            .When(x => x.Tags != null && x.Tags.Any());

        RuleFor(x => x.MinimumExperienceYears)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Minimum experience years must be 0 or greater")
            .LessThanOrEqualTo(50)
            .WithMessage("Minimum experience years cannot exceed 50")
            .When(x => x.MinimumExperienceYears.HasValue);

        // Validate skill level vs experience requirements
        RuleFor(x => x)
            .Must(x => ValidateSkillLevelVsExperience(x.SkillLevel, x.MinimumExperienceYears))
            .WithMessage("Minimum experience years should align with skill level")
            .When(x => x.MinimumExperienceYears.HasValue);
    }

    private bool BeValidUrl(string? url)
    {
        if (string.IsNullOrEmpty(url))
            return true;

        return Uri.TryCreate(url, UriKind.Absolute, out var uriResult)
            && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
    }

    private bool ValidateSkillLevelVsExperience(SkillLevel skillLevel, int? experienceYears)
    {
        if (!experienceYears.HasValue)
            return true;

        return skillLevel switch
        {
            SkillLevel.Helper => experienceYears <= 1,
            SkillLevel.SemiSkilled => experienceYears >= 1 && experienceYears <= 3,
            SkillLevel.Skilled => experienceYears >= 2 && experienceYears <= 10,
            SkillLevel.HighlySkilled => experienceYears >= 5 && experienceYears <= 20,
            SkillLevel.Expert => experienceYears >= 10,
            _ => true
        };
    }
}

/// <summary>
/// Validator for UpdateLaborCategoryRequest
/// </summary>
public class UpdateLaborCategoryRequestValidator : AbstractValidator<UpdateLaborCategoryRequest>
{
    public UpdateLaborCategoryRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Labor category name cannot be empty if provided")
            .MaximumLength(200)
            .WithMessage("Labor category name cannot exceed 200 characters")
            .Matches(@"^[a-zA-Z0-9\s\-\(\)]+$")
            .WithMessage("Labor category name can only contain letters, numbers, spaces, hyphens, and parentheses")
            .When(x => x.Name != null);

        RuleFor(x => x.Description)
            .MaximumLength(1000)
            .WithMessage("Description cannot exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.BaseHourlyRate)
            .GreaterThan(0)
            .WithMessage("Base hourly rate must be greater than 0")
            .LessThanOrEqualTo(10000)
            .WithMessage("Base hourly rate cannot exceed ₹10,000 per hour")
            .When(x => x.BaseHourlyRate.HasValue);

        RuleFor(x => x.BaseDailyRate)
            .GreaterThan(0)
            .WithMessage("Base daily rate must be greater than 0")
            .LessThanOrEqualTo(50000)
            .WithMessage("Base daily rate cannot exceed ₹50,000 per day")
            .When(x => x.BaseDailyRate.HasValue);

        RuleFor(x => x.SkillLevel)
            .IsInEnum()
            .WithMessage("Skill level must be a valid value (Helper, SemiSkilled, Skilled, HighlySkilled, Expert)")
            .When(x => x.SkillLevel.HasValue);

        RuleFor(x => x.IconUrl)
            .Must(BeValidUrl)
            .WithMessage("Icon URL must be a valid URL")
            .When(x => !string.IsNullOrEmpty(x.IconUrl));

        RuleFor(x => x.DisplayOrder)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Display order must be 0 or greater")
            .When(x => x.DisplayOrder.HasValue);

        RuleFor(x => x.Tags)
            .Must(tags => tags!.Count <= 10)
            .WithMessage("Cannot have more than 10 tags")
            .Must(tags => tags!.All(t => t.Length <= 50))
            .WithMessage("Each tag cannot exceed 50 characters")
            .When(x => x.Tags != null && x.Tags.Any());

        RuleFor(x => x.MinimumExperienceYears)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Minimum experience years must be 0 or greater")
            .LessThanOrEqualTo(50)
            .WithMessage("Minimum experience years cannot exceed 50")
            .When(x => x.MinimumExperienceYears.HasValue);
    }

    private bool BeValidUrl(string? url)
    {
        if (string.IsNullOrEmpty(url))
            return true;

        return Uri.TryCreate(url, UriKind.Absolute, out var uriResult)
            && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
    }
}
