using FluentValidation;
using VendorService.Models.Requests;

namespace VendorService.Validators;

/// <summary>
/// Validator for CreateInventoryItemRequest
/// </summary>
public class CreateInventoryItemRequestValidator : AbstractValidator<CreateInventoryItemRequest>
{
    public CreateInventoryItemRequestValidator()
    {
        RuleFor(x => x.VendorId)
            .NotEmpty()
            .WithMessage("Vendor ID is required");

        RuleFor(x => x.ProductId)
            .NotEmpty()
            .WithMessage("Product ID is required");

        RuleFor(x => x.Price)
            .GreaterThan(0)
            .WithMessage("Price must be greater than 0")
            .LessThanOrEqualTo(10000000)
            .WithMessage("Price cannot exceed ₹1 crore");

        RuleFor(x => x.MinOrderQuantity)
            .GreaterThan(0)
            .WithMessage("Minimum order quantity must be greater than 0")
            .LessThanOrEqualTo(10000)
            .WithMessage("Minimum order quantity cannot exceed 10,000");

        RuleFor(x => x.MaxOrderQuantity)
            .GreaterThan(x => x.MinOrderQuantity)
            .WithMessage("Maximum order quantity must be greater than minimum order quantity")
            .When(x => x.MaxOrderQuantity.HasValue);

        RuleFor(x => x.StockQuantity)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Stock quantity must be 0 or greater")
            .LessThanOrEqualTo(1000000)
            .WithMessage("Stock quantity cannot exceed 1,000,000");

        RuleFor(x => x.LeadTimeDays)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Lead time must be 0 or greater")
            .LessThanOrEqualTo(365)
            .WithMessage("Lead time cannot exceed 365 days");
    }
}

/// <summary>
/// Validator for UpdateInventoryItemRequest
/// </summary>
public class UpdateInventoryItemRequestValidator : AbstractValidator<UpdateInventoryItemRequest>
{
    public UpdateInventoryItemRequestValidator()
    {
        RuleFor(x => x.Price)
            .GreaterThan(0)
            .WithMessage("Price must be greater than 0")
            .LessThanOrEqualTo(10000000)
            .WithMessage("Price cannot exceed ₹1 crore")
            .When(x => x.Price.HasValue);

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

        RuleFor(x => x.StockQuantity)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Stock quantity must be 0 or greater")
            .LessThanOrEqualTo(1000000)
            .WithMessage("Stock quantity cannot exceed 1,000,000")
            .When(x => x.StockQuantity.HasValue);

        RuleFor(x => x.LeadTimeDays)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Lead time must be 0 or greater")
            .LessThanOrEqualTo(365)
            .WithMessage("Lead time cannot exceed 365 days")
            .When(x => x.LeadTimeDays.HasValue);
    }
}

/// <summary>
/// Validator for CreateBankAccountRequest
/// </summary>
public class CreateBankAccountRequestValidator : AbstractValidator<CreateBankAccountRequest>
{
    public CreateBankAccountRequestValidator()
    {
        RuleFor(x => x.VendorId)
            .NotEmpty()
            .WithMessage("Vendor ID is required");

        RuleFor(x => x.BankName)
            .NotEmpty()
            .WithMessage("Bank name is required")
            .MaximumLength(100)
            .WithMessage("Bank name cannot exceed 100 characters");

        RuleFor(x => x.AccountHolderName)
            .NotEmpty()
            .WithMessage("Account holder name is required")
            .MaximumLength(200)
            .WithMessage("Account holder name cannot exceed 200 characters")
            .Matches(@"^[a-zA-Z\s\.]+$")
            .WithMessage("Account holder name can only contain letters, spaces, and periods");

        RuleFor(x => x.AccountNumber)
            .NotEmpty()
            .WithMessage("Account number is required")
            .MinimumLength(9)
            .MaximumLength(18)
            .WithMessage("Account number must be between 9 and 18 digits")
            .Matches(@"^\d+$")
            .WithMessage("Account number must contain only digits");

        RuleFor(x => x.IfscCode)
            .NotEmpty()
            .WithMessage("IFSC code is required")
            .Length(11)
            .WithMessage("IFSC code must be exactly 11 characters")
            .Matches(@"^[A-Z]{4}0[A-Z0-9]{6}$")
            .WithMessage("IFSC code format is invalid (e.g., SBIN0001234)");

        RuleFor(x => x.AccountType)
            .NotEmpty()
            .WithMessage("Account type is required")
            .Must(type => new[] { "Savings", "Current", "CC", "OD" }.Contains(type))
            .WithMessage("Account type must be one of: Savings, Current, CC, OD");

        RuleFor(x => x.BranchName)
            .MaximumLength(100)
            .WithMessage("Branch name cannot exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.BranchName));
    }
}

/// <summary>
/// Validator for CreateDocumentRequest (KYC)
/// </summary>
public class CreateDocumentRequestValidator : AbstractValidator<CreateDocumentRequest>
{
    public CreateDocumentRequestValidator()
    {
        RuleFor(x => x.VendorId)
            .NotEmpty()
            .WithMessage("Vendor ID is required");

        RuleFor(x => x.DocumentType)
            .NotEmpty()
            .WithMessage("Document type is required")
            .Must(type => new[]
            {
                "PAN", "GST", "BusinessRegistration", "AddressProof",
                "BankStatement", "CancelledCheque", "OwnerPhoto",
                "OwnerAadhaar", "TradeLicense"
            }.Contains(type))
            .WithMessage("Invalid document type");

        RuleFor(x => x.DocumentNumber)
            .MaximumLength(50)
            .WithMessage("Document number cannot exceed 50 characters")
            .When(x => !string.IsNullOrEmpty(x.DocumentNumber));

        RuleFor(x => x.DocumentUrl)
            .NotEmpty()
            .WithMessage("Document URL is required")
            .Must(BeValidUrl)
            .WithMessage("Document URL must be a valid URL");

        RuleFor(x => x.ExpiryDate)
            .GreaterThan(DateTime.UtcNow)
            .WithMessage("Expiry date must be in the future")
            .When(x => x.ExpiryDate.HasValue);
    }

    private bool BeValidUrl(string? url)
    {
        if (string.IsNullOrEmpty(url))
            return false;

        return Uri.TryCreate(url, UriKind.Absolute, out var uriResult)
            && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
    }
}
