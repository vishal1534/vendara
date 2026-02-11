using IntegrationService.Models.Requests;
using IntegrationService.Models.Responses;

namespace IntegrationService.Services.Interfaces;

public interface IGoogleMapsService
{
    Task<GeocodeResponse> GeocodeAddressAsync(string address);
    Task<ReverseGeocodeResponse> ReverseGeocodeAsync(double latitude, double longitude);
    Task<DistanceCalculationResponse> CalculateDistanceAsync(string originAddress, string destinationAddress);
    Task<HaversineDistanceResponse> CalculateHaversineDistanceAsync(double originLat, double originLon, double destLat, double destLon);
}
