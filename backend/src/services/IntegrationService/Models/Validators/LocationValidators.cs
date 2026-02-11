using FluentValidation;
using IntegrationService.Models.Requests;

namespace IntegrationService.Models.Validators;

/// <summary>
/// Validator for GeocodeAddressRequest
/// </summary>
public class GeocodeAddressRequestValidator : AbstractValidator<GeocodeAddressRequest>
{
    public GeocodeAddressRequestValidator()
    {
        RuleFor(x => x.Address)
            .NotEmpty().WithMessage("Address is required")
            .MinimumLength(10).WithMessage("Address must be at least 10 characters")
            .MaximumLength(500).WithMessage("Address cannot exceed 500 characters");
    }
}

/// <summary>
/// Validator for ReverseGeocodeRequest
/// </summary>
public class ReverseGeocodeRequestValidator : AbstractValidator<ReverseGeocodeRequest>
{
    public ReverseGeocodeRequestValidator()
    {
        RuleFor(x => x.Latitude)
            .InclusiveBetween(-90, 90).WithMessage("Latitude must be between -90 and 90 degrees");

        RuleFor(x => x.Longitude)
            .InclusiveBetween(-180, 180).WithMessage("Longitude must be between -180 and 180 degrees");
    }
}

/// <summary>
/// Validator for CalculateDistanceRequest
/// </summary>
public class CalculateDistanceRequestValidator : AbstractValidator<CalculateDistanceRequest>
{
    public CalculateDistanceRequestValidator()
    {
        RuleFor(x => x.OriginAddress)
            .NotEmpty().WithMessage("Origin address is required")
            .MinimumLength(10).WithMessage("Origin address must be at least 10 characters")
            .MaximumLength(500).WithMessage("Origin address cannot exceed 500 characters");

        RuleFor(x => x.DestinationAddress)
            .NotEmpty().WithMessage("Destination address is required")
            .MinimumLength(10).WithMessage("Destination address must be at least 10 characters")
            .MaximumLength(500).WithMessage("Destination address cannot exceed 500 characters");

        RuleFor(x => x)
            .Must(x => x.OriginAddress != x.DestinationAddress)
            .WithMessage("Origin and destination addresses cannot be the same");
    }
}

/// <summary>
/// Validator for CalculateDistanceByCoordinatesRequest
/// </summary>
public class CalculateDistanceByCoordinatesRequestValidator : AbstractValidator<CalculateDistanceByCoordinatesRequest>
{
    public CalculateDistanceByCoordinatesRequestValidator()
    {
        RuleFor(x => x.OriginLatitude)
            .InclusiveBetween(-90, 90).WithMessage("Origin latitude must be between -90 and 90 degrees");

        RuleFor(x => x.OriginLongitude)
            .InclusiveBetween(-180, 180).WithMessage("Origin longitude must be between -180 and 180 degrees");

        RuleFor(x => x.DestinationLatitude)
            .InclusiveBetween(-90, 90).WithMessage("Destination latitude must be between -90 and 90 degrees");

        RuleFor(x => x.DestinationLongitude)
            .InclusiveBetween(-180, 180).WithMessage("Destination longitude must be between -180 and 180 degrees");

        RuleFor(x => x)
            .Must(x => !(Math.Abs(x.OriginLatitude - x.DestinationLatitude) < 0.0001 && 
                         Math.Abs(x.OriginLongitude - x.DestinationLongitude) < 0.0001))
            .WithMessage("Origin and destination coordinates cannot be the same");
    }
}
