using CatalogService.Models.DTOs;
using FluentValidation;

namespace CatalogService.Validators;

/// <summary>
/// Validator for CreateMaterialRequest
/// </summary>
public class CreateMaterialRequestValidator : AbstractValidator<CreateMaterialRequest>
{
    public CreateMaterialRequestValidator()
    {
        RuleFor(x => x.CategoryId)
            .NotEmpty()
            .WithMessage("Category ID is required");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Material name is required")
            .MaximumLength(200)
            .WithMessage("Material name cannot exceed 200 characters")
            .Matches(@"^[a-zA-Z0-9\s\-\(\)\.]+$")
            .WithMessage("Material name can only contain letters, numbers, spaces, hyphens, parentheses, and periods");

        RuleFor(x => x.Description)
            .MaximumLength(1000)
            .WithMessage("Description cannot exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.Sku)
            .MaximumLength(50)
            .WithMessage("SKU cannot exceed 50 characters")
            .Matches(@"^[a-zA-Z0-9\-]+$")
            .WithMessage("SKU can only contain letters, numbers, and hyphens")
            .When(x => !string.IsNullOrEmpty(x.Sku));

        RuleFor(x => x.BasePrice)
            .GreaterThan(0)
            .WithMessage("Base price must be greater than 0")
            .LessThanOrEqualTo(10000000)
            .WithMessage("Base price cannot exceed 1 crore");

        RuleFor(x => x.Unit)
            .NotEmpty()
            .WithMessage("Unit is required")
            .MaximumLength(20)
            .WithMessage("Unit cannot exceed 20 characters")
            .Must(BeValidUnit)
            .WithMessage("Unit must be one of: kg, ton, bag, piece, box, sqft, sqm, cft, cfm, litre, meter, roll");

        RuleFor(x => x.MinOrderQuantity)
            .GreaterThan(0)
            .WithMessage("Minimum order quantity must be greater than 0")
            .LessThanOrEqualTo(10000)
            .WithMessage("Minimum order quantity cannot exceed 10,000");

        RuleFor(x => x.MaxOrderQuantity)
            .GreaterThan(x => x.MinOrderQuantity)
            .WithMessage("Maximum order quantity must be greater than minimum order quantity")
            .When(x => x.MaxOrderQuantity.HasValue);

        RuleFor(x => x.ImageUrl)
            .Must(BeValidUrl)
            .WithMessage("Image URL must be a valid URL")
            .When(x => !string.IsNullOrEmpty(x.ImageUrl));

        RuleFor(x => x.Brand)
            .MaximumLength(100)
            .WithMessage("Brand cannot exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.Brand));

        RuleFor(x => x.Specifications)
            .MaximumLength(2000)
            .WithMessage("Specifications cannot exceed 2000 characters")
            .When(x => !string.IsNullOrEmpty(x.Specifications));

        RuleFor(x => x.HsnCode)
            .Length(4, 8)
            .WithMessage("HSN code must be 4 to 8 digits")
            .Matches(@"^\d+$")
            .WithMessage("HSN code must contain only digits")
            .When(x => !string.IsNullOrEmpty(x.HsnCode));

        RuleFor(x => x.GstPercentage)
            .GreaterThanOrEqualTo(0)
            .WithMessage("GST percentage must be 0 or greater")
            .LessThanOrEqualTo(28)
            .WithMessage("GST percentage cannot exceed 28%")
            .Must(BeValidGstRate)
            .WithMessage("GST percentage must be one of: 0, 5, 12, 18, 28");

        RuleFor(x => x.DisplayOrder)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Display order must be 0 or greater");

        RuleFor(x => x.Tags)
            .Must(tags => tags.Count <= 10)
            .WithMessage("Cannot have more than 10 tags")
            .Must(tags => tags.All(t => t.Length <= 50))
            .WithMessage("Each tag cannot exceed 50 characters")
            .When(x => x.Tags != null && x.Tags.Any());
    }

    private bool BeValidUnit(string unit)
    {
        var validUnits = new[]
        {
            "kg", "ton", "bag", "piece", "box", 
            "sqft", "sqm", "cft", "cfm", 
            "litre", "meter", "roll", "pcs", "nos"
        };
        return validUnits.Contains(unit.ToLower());
    }

    private bool BeValidUrl(string? url)
    {
        if (string.IsNullOrEmpty(url))
            return true;

        return Uri.TryCreate(url, UriKind.Absolute, out var uriResult)
            && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
    }

    private bool BeValidGstRate(decimal gstPercentage)
    {
        var validRates = new[] { 0m, 5m, 12m, 18m, 28m };
        return validRates.Contains(gstPercentage);
    }
}

/// <summary>
/// Validator for UpdateMaterialRequest
/// </summary>
public class UpdateMaterialRequestValidator : AbstractValidator<UpdateMaterialRequest>
{
    public UpdateMaterialRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Material name cannot be empty if provided")
            .MaximumLength(200)
            .WithMessage("Material name cannot exceed 200 characters")
            .Matches(@"^[a-zA-Z0-9\s\-\(\)\.]+$")
            .WithMessage("Material name can only contain letters, numbers, spaces, hyphens, parentheses, and periods")
            .When(x => x.Name != null);

        RuleFor(x => x.Description)
            .MaximumLength(1000)
            .WithMessage("Description cannot exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.BasePrice)
            .GreaterThan(0)
            .WithMessage("Base price must be greater than 0")
            .LessThanOrEqualTo(10000000)
            .WithMessage("Base price cannot exceed 1 crore")
            .When(x => x.BasePrice.HasValue);

        RuleFor(x => x.MinOrderQuantity)
            .GreaterThan(0)
            .WithMessage("Minimum order quantity must be greater than 0")
            .LessThanOrEqualTo(10000)
            .WithMessage("Minimum order quantity cannot exceed 10,000")
            .When(x => x.MinOrderQuantity.HasValue);

        RuleFor(x => x.MaxOrderQuantity)
            .GreaterThan(0)
            .WithMessage("Maximum order quantity must be greater than 0")
            .When(x => x.MaxOrderQuantity.HasValue);

        RuleFor(x => x.ImageUrl)
            .Must(BeValidUrl)
            .WithMessage("Image URL must be a valid URL")
            .When(x => !string.IsNullOrEmpty(x.ImageUrl));

        RuleFor(x => x.Brand)
            .MaximumLength(100)
            .WithMessage("Brand cannot exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.Brand));

        RuleFor(x => x.Specifications)
            .MaximumLength(2000)
            .WithMessage("Specifications cannot exceed 2000 characters")
            .When(x => !string.IsNullOrEmpty(x.Specifications));

        RuleFor(x => x.GstPercentage)
            .GreaterThanOrEqualTo(0)
            .WithMessage("GST percentage must be 0 or greater")
            .LessThanOrEqualTo(28)
            .WithMessage("GST percentage cannot exceed 28%")
            .Must(gst => new[] { 0m, 5m, 12m, 18m, 28m }.Contains(gst.Value))
            .WithMessage("GST percentage must be one of: 0, 5, 12, 18, 28")
            .When(x => x.GstPercentage.HasValue);

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
    }

    private bool BeValidUrl(string? url)
    {
        if (string.IsNullOrEmpty(url))
            return true;

        return Uri.TryCreate(url, UriKind.Absolute, out var uriResult)
            && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
    }
}
