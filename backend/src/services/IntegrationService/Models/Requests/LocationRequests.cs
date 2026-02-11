namespace IntegrationService.Models.Requests;

/// <summary>
/// Request to geocode an address
/// </summary>
public class GeocodeAddressRequest
{
    public string Address { get; set; } = string.Empty;
}

/// <summary>
/// Request to reverse geocode coordinates
/// </summary>
public class ReverseGeocodeRequest
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}

/// <summary>
/// Request to calculate distance between two locations
/// </summary>
public class CalculateDistanceRequest
{
    public string OriginAddress { get; set; } = string.Empty;
    public string DestinationAddress { get; set; } = string.Empty;
}

/// <summary>
/// Request to calculate distance using coordinates
/// </summary>
public class CalculateDistanceByCoordinatesRequest
{
    public double OriginLatitude { get; set; }
    public double OriginLongitude { get; set; }
    public double DestinationLatitude { get; set; }
    public double DestinationLongitude { get; set; }
}
