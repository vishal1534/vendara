namespace IntegrationService.Models.Responses;

/// <summary>
/// Response for geocoding an address
/// </summary>
public class GeocodeResponse
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string FormattedAddress { get; set; } = string.Empty;
    public string? City { get; set; }
    public string? State { get; set; }
    public string? PostalCode { get; set; }
    public string? Country { get; set; }
    public string? PlaceId { get; set; }
    public bool FromCache { get; set; }
}

/// <summary>
/// Response for reverse geocoding coordinates
/// </summary>
public class ReverseGeocodeResponse
{
    public string FormattedAddress { get; set; } = string.Empty;
    public string? City { get; set; }
    public string? State { get; set; }
    public string? PostalCode { get; set; }
    public string? Country { get; set; }
    public string? PlaceId { get; set; }
}

/// <summary>
/// Response for distance calculation
/// </summary>
public class DistanceCalculationResponse
{
    public double DistanceInKilometers { get; set; }
    public double DistanceInMeters { get; set; }
    public int DurationInSeconds { get; set; }
    public string DurationText { get; set; } = string.Empty; // "25 mins"
    public string DistanceText { get; set; } = string.Empty; // "12.5 km"
    public GeocodeResponse Origin { get; set; } = null!;
    public GeocodeResponse Destination { get; set; } = null!;
}

/// <summary>
/// Response for haversine distance (without Google Maps API)
/// </summary>
public class HaversineDistanceResponse
{
    public double DistanceInKilometers { get; set; }
    public double DistanceInMeters { get; set; }
    public string DistanceText { get; set; } = string.Empty;
}
