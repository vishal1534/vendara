using FluentValidation;
using VendorService.Models.Requests;

namespace VendorService.Validators;

/// <summary>
/// Validator for CreateVendorRequest
/// </summary>
public class CreateVendorRequestValidator : AbstractValidator<CreateVendorRequest>
{
    public CreateVendorRequestValidator()
    {
        RuleFor(x => x.BusinessName)
            .NotEmpty()
            .WithMessage("Business name is required")
            .MaximumLength(200)
            .WithMessage("Business name cannot exceed 200 characters")
            .Matches(@"^[a-zA-Z0-9\s\.\-\&,]+$")
            .WithMessage("Business name contains invalid characters");

        RuleFor(x => x.BusinessRegistrationNumber)
            .MaximumLength(50)
            .WithMessage("Business registration number cannot exceed 50 characters")
            .Matches(@"^[a-zA-Z0-9\-]+$")
            .WithMessage("Business registration number can only contain letters, numbers, and hyphens")
            .When(x => !string.IsNullOrEmpty(x.BusinessRegistrationNumber));

        RuleFor(x => x.GstNumber)
            .Length(15)
            .WithMessage("GST number must be exactly 15 characters")
            .Matches(@"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")
            .WithMessage("GST number format is invalid (e.g., 36AABCT1332L1Z5)")
            .When(x => !string.IsNullOrEmpty(x.GstNumber));

        RuleFor(x => x.PanNumber)
            .Length(10)
            .WithMessage("PAN number must be exactly 10 characters")
            .Matches(@"^[A-Z]{5}[0-9]{4}[A-Z]{1}$")
            .WithMessage("PAN number format is invalid (e.g., ABCTY1234D)")
            .When(x => !string.IsNullOrEmpty(x.PanNumber));

        RuleFor(x => x.ContactPersonName)
            .NotEmpty()
            .WithMessage("Contact person name is required")
            .MaximumLength(100)
            .WithMessage("Contact person name cannot exceed 100 characters")
            .Matches(@"^[a-zA-Z\s\.]+$")
            .WithMessage("Contact person name can only contain letters, spaces, and periods");

        RuleFor(x => x.PhoneNumber)
            .NotEmpty()
            .WithMessage("Phone number is required")
            .Matches(@"^[6-9]\d{9}$")
            .WithMessage("Phone number must be a valid 10-digit Indian mobile number starting with 6-9");

        RuleFor(x => x.AlternatePhoneNumber)
            .Matches(@"^[6-9]\d{9}$")
            .WithMessage("Alternate phone number must be a valid 10-digit Indian mobile number")
            .When(x => !string.IsNullOrEmpty(x.AlternatePhoneNumber));

        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email is required")
            .EmailAddress()
            .WithMessage("Email must be a valid email address")
            .MaximumLength(100)
            .WithMessage("Email cannot exceed 100 characters");

        RuleFor(x => x.WhatsAppNumber)
            .Matches(@"^[6-9]\d{9}$")
            .WithMessage("WhatsApp number must be a valid 10-digit Indian mobile number")
            .When(x => !string.IsNullOrEmpty(x.WhatsAppNumber));

        RuleFor(x => x.AddressLine1)
            .NotEmpty()
            .WithMessage("Address line 1 is required")
            .MaximumLength(200)
            .WithMessage("Address line 1 cannot exceed 200 characters");

        RuleFor(x => x.AddressLine2)
            .MaximumLength(200)
            .WithMessage("Address line 2 cannot exceed 200 characters")
            .When(x => !string.IsNullOrEmpty(x.AddressLine2));

        RuleFor(x => x.Landmark)
            .MaximumLength(100)
            .WithMessage("Landmark cannot exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.Landmark));

        RuleFor(x => x.City)
            .NotEmpty()
            .WithMessage("City is required")
            .MaximumLength(100)
            .WithMessage("City cannot exceed 100 characters")
            .Matches(@"^[a-zA-Z\s]+$")
            .WithMessage("City can only contain letters and spaces");

        RuleFor(x => x.State)
            .NotEmpty()
            .WithMessage("State is required")
            .MaximumLength(100)
            .WithMessage("State cannot exceed 100 characters")
            .Must(BeValidIndianState)
            .WithMessage("State must be a valid Indian state");

        RuleFor(x => x.PostalCode)
            .NotEmpty()
            .WithMessage("Postal code is required")
            .Matches(@"^\d{6}$")
            .WithMessage("Postal code must be a valid 6-digit Indian PIN code");

        RuleFor(x => x.Latitude)
            .InclusiveBetween(-90, 90)
            .WithMessage("Latitude must be between -90 and 90")
            .When(x => x.Latitude.HasValue);

        RuleFor(x => x.Longitude)
            .InclusiveBetween(-180, 180)
            .WithMessage("Longitude must be between -180 and 180")
            .When(x => x.Longitude.HasValue);

        RuleFor(x => x.Description)
            .MaximumLength(1000)
            .WithMessage("Description cannot exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.YearsInBusiness)
            .InclusiveBetween(0, 100)
            .WithMessage("Years in business must be between 0 and 100");

        RuleFor(x => x.BusinessType)
            .MaximumLength(50)
            .WithMessage("Business type cannot exceed 50 characters")
            .When(x => !string.IsNullOrEmpty(x.BusinessType));

        RuleFor(x => x.SpecializationAreas)
            .MaximumLength(500)
            .WithMessage("Specialization areas cannot exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.SpecializationAreas));

        RuleFor(x => x.MinimumOrderValue)
            .GreaterThan(0)
            .WithMessage("Minimum order value must be greater than 0")
            .LessThanOrEqualTo(1000000)
            .WithMessage("Minimum order value cannot exceed ₹10 lakh")
            .When(x => x.MinimumOrderValue.HasValue);

        RuleFor(x => x.CreditDays)
            .InclusiveBetween(0, 365)
            .WithMessage("Credit days must be between 0 and 365")
            .When(x => x.CreditDays.HasValue);

        // Business logic: If AcceptsCredit is true, CreditDays should be provided
        RuleFor(x => x.CreditDays)
            .NotNull()
            .WithMessage("Credit days must be specified when credit is accepted")
            .GreaterThan(0)
            .WithMessage("Credit days must be greater than 0 when credit is accepted")
            .When(x => x.AcceptsCredit);
    }

    private bool BeValidIndianState(string state)
    {
        var validStates = new[]
        {
            "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
            "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
            "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
            "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
            "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
            "Uttar Pradesh", "Uttarakhand", "West Bengal",
            "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
            "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
        };

        return validStates.Contains(state, StringComparer.OrdinalIgnoreCase);
    }
}

/// <summary>
/// Validator for UpdateVendorRequest
/// </summary>
public class UpdateVendorRequestValidator : AbstractValidator<UpdateVendorRequest>
{
    public UpdateVendorRequestValidator()
    {
        RuleFor(x => x.BusinessName)
            .NotEmpty()
            .WithMessage("Business name cannot be empty if provided")
            .MaximumLength(200)
            .WithMessage("Business name cannot exceed 200 characters")
            .Matches(@"^[a-zA-Z0-9\s\.\-\&,]+$")
            .WithMessage("Business name contains invalid characters")
            .When(x => x.BusinessName != null);

        RuleFor(x => x.ContactPersonName)
            .NotEmpty()
            .WithMessage("Contact person name cannot be empty if provided")
            .MaximumLength(100)
            .WithMessage("Contact person name cannot exceed 100 characters")
            .Matches(@"^[a-zA-Z\s\.]+$")
            .WithMessage("Contact person name can only contain letters, spaces, and periods")
            .When(x => x.ContactPersonName != null);

        RuleFor(x => x.AlternatePhoneNumber)
            .Matches(@"^[6-9]\d{9}$")
            .WithMessage("Alternate phone number must be a valid 10-digit Indian mobile number")
            .When(x => !string.IsNullOrEmpty(x.AlternatePhoneNumber));

        RuleFor(x => x.WhatsAppNumber)
            .Matches(@"^[6-9]\d{9}$")
            .WithMessage("WhatsApp number must be a valid 10-digit Indian mobile number")
            .When(x => !string.IsNullOrEmpty(x.WhatsAppNumber));

        RuleFor(x => x.AddressLine1)
            .NotEmpty()
            .WithMessage("Address line 1 cannot be empty if provided")
            .MaximumLength(200)
            .WithMessage("Address line 1 cannot exceed 200 characters")
            .When(x => x.AddressLine1 != null);

        RuleFor(x => x.AddressLine2)
            .MaximumLength(200)
            .WithMessage("Address line 2 cannot exceed 200 characters")
            .When(x => !string.IsNullOrEmpty(x.AddressLine2));

        RuleFor(x => x.Landmark)
            .MaximumLength(100)
            .WithMessage("Landmark cannot exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.Landmark));

        RuleFor(x => x.City)
            .NotEmpty()
            .WithMessage("City cannot be empty if provided")
            .MaximumLength(100)
            .WithMessage("City cannot exceed 100 characters")
            .Matches(@"^[a-zA-Z\s]+$")
            .WithMessage("City can only contain letters and spaces")
            .When(x => x.City != null);

        RuleFor(x => x.State)
            .NotEmpty()
            .WithMessage("State cannot be empty if provided")
            .MaximumLength(100)
            .WithMessage("State cannot exceed 100 characters")
            .When(x => x.State != null);

        RuleFor(x => x.PostalCode)
            .Matches(@"^\d{6}$")
            .WithMessage("Postal code must be a valid 6-digit Indian PIN code")
            .When(x => !string.IsNullOrEmpty(x.PostalCode));

        RuleFor(x => x.Latitude)
            .InclusiveBetween(-90, 90)
            .WithMessage("Latitude must be between -90 and 90")
            .When(x => x.Latitude.HasValue);

        RuleFor(x => x.Longitude)
            .InclusiveBetween(-180, 180)
            .WithMessage("Longitude must be between -180 and 180")
            .When(x => x.Longitude.HasValue);

        RuleFor(x => x.Description)
            .MaximumLength(1000)
            .WithMessage("Description cannot exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.YearsInBusiness)
            .InclusiveBetween(0, 100)
            .WithMessage("Years in business must be between 0 and 100")
            .When(x => x.YearsInBusiness.HasValue);

        RuleFor(x => x.BusinessType)
            .MaximumLength(50)
            .WithMessage("Business type cannot exceed 50 characters")
            .When(x => !string.IsNullOrEmpty(x.BusinessType));

        RuleFor(x => x.SpecializationAreas)
            .MaximumLength(500)
            .WithMessage("Specialization areas cannot exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.SpecializationAreas));

        RuleFor(x => x.MinimumOrderValue)
            .GreaterThan(0)
            .WithMessage("Minimum order value must be greater than 0")
            .LessThanOrEqualTo(1000000)
            .WithMessage("Minimum order value cannot exceed ₹10 lakh")
            .When(x => x.MinimumOrderValue.HasValue);

        RuleFor(x => x.CreditDays)
            .InclusiveBetween(0, 365)
            .WithMessage("Credit days must be between 0 and 365")
            .When(x => x.CreditDays.HasValue);

        // Business logic: If AcceptsCredit is set to true, CreditDays should be provided
        RuleFor(x => x.CreditDays)
            .NotNull()
            .WithMessage("Credit days must be specified when credit is accepted")
            .GreaterThan(0)
            .WithMessage("Credit days must be greater than 0 when credit is accepted")
            .When(x => x.AcceptsCredit == true);
    }
}