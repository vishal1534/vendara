using System.Text.Json;
using IntegrationService.Models.Entities;
using IntegrationService.Models.Requests;
using IntegrationService.Models.Responses;
using IntegrationService.Repositories.Interfaces;
using IntegrationService.Services.Interfaces;

namespace IntegrationService.Services;

public class GoogleMapsService : IGoogleMapsService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILocationCacheRepository _cacheRepository;
    private readonly IConfiguration _configuration;
    private readonly ILogger<GoogleMapsService> _logger;

    private readonly string _apiKey;

    public GoogleMapsService(
        IHttpClientFactory httpClientFactory,
        ILocationCacheRepository cacheRepository,
        IConfiguration configuration,
        ILogger<GoogleMapsService> logger)
    {
        _httpClientFactory = httpClientFactory;
        _cacheRepository = cacheRepository;
        _configuration = configuration;
        _logger = logger;

        _apiKey = configuration["GoogleMaps:ApiKey"] ?? throw new InvalidOperationException("Google Maps API Key not configured");
    }

    public async Task<GeocodeResponse> GeocodeAddressAsync(string address)
    {
        try
        {
            // Check cache first
            var cached = await _cacheRepository.GetByAddressAsync(address);
            if (cached != null)
            {
                await _cacheRepository.UpdateHitCountAsync(cached.Id);
                _logger.LogInformation("Geocode result from cache: {Address}", address);

                return new GeocodeResponse
                {
                    Latitude = cached.Latitude,
                    Longitude = cached.Longitude,
                    FormattedAddress = cached.FormattedAddress ?? address,
                    City = cached.City,
                    State = cached.State,
                    PostalCode = cached.PostalCode,
                    Country = cached.Country,
                    PlaceId = cached.PlaceId,
                    FromCache = true
                };
            }

            // Call Google Maps Geocoding API
            var client = _httpClientFactory.CreateClient("GoogleMaps");
            var url = $"geocode/json?address={Uri.EscapeDataString(address)}&key={_apiKey}";

            var response = await client.GetAsync(url);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Google Maps API error: {StatusCode} - {Body}", response.StatusCode, responseBody);
                throw new Exception($"Google Maps API error: {response.StatusCode}");
            }

            var result = JsonSerializer.Deserialize<GoogleMapsGeocodeResponse>(responseBody);

            if (result?.Status != "OK" || result.Results == null || !result.Results.Any())
            {
                throw new Exception($"Geocoding failed: {result?.Status ?? "Unknown error"}");
            }

            var firstResult = result.Results.First();
            var location = firstResult.Geometry?.Location;

            if (location == null)
            {
                throw new Exception("No location found in geocoding result");
            }

            // Extract address components
            var city = ExtractAddressComponent(firstResult.AddressComponents, "locality") 
                       ?? ExtractAddressComponent(firstResult.AddressComponents, "administrative_area_level_2");
            var state = ExtractAddressComponent(firstResult.AddressComponents, "administrative_area_level_1");
            var postalCode = ExtractAddressComponent(firstResult.AddressComponents, "postal_code");
            var country = ExtractAddressComponent(firstResult.AddressComponents, "country");

            // Cache the result
            var cacheEntry = new LocationCache
            {
                Address = address,
                NormalizedAddress = address.Trim().ToLowerInvariant(),
                Latitude = location.Lat,
                Longitude = location.Lng,
                FormattedAddress = firstResult.FormattedAddress,
                City = city,
                State = state,
                PostalCode = postalCode,
                Country = country,
                PlaceId = firstResult.PlaceId,
                AddressComponents = JsonSerializer.Serialize(firstResult.AddressComponents)
            };

            await _cacheRepository.CreateAsync(cacheEntry);

            _logger.LogInformation("Geocoded address: {Address} -> ({Lat}, {Lng})", address, location.Lat, location.Lng);

            return new GeocodeResponse
            {
                Latitude = location.Lat,
                Longitude = location.Lng,
                FormattedAddress = firstResult.FormattedAddress ?? address,
                City = city,
                State = state,
                PostalCode = postalCode,
                Country = country,
                PlaceId = firstResult.PlaceId,
                FromCache = false
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error geocoding address: {Address}", address);
            throw;
        }
    }

    public async Task<ReverseGeocodeResponse> ReverseGeocodeAsync(double latitude, double longitude)
    {
        try
        {
            // Check cache first
            var cached = await _cacheRepository.GetByCoordinatesAsync(latitude, longitude);
            if (cached != null)
            {
                await _cacheRepository.UpdateHitCountAsync(cached.Id);
                _logger.LogInformation("Reverse geocode result from cache: ({Lat}, {Lng})", latitude, longitude);

                return new ReverseGeocodeResponse
                {
                    FormattedAddress = cached.FormattedAddress ?? "",
                    City = cached.City,
                    State = cached.State,
                    PostalCode = cached.PostalCode,
                    Country = cached.Country,
                    PlaceId = cached.PlaceId
                };
            }

            // Call Google Maps Reverse Geocoding API
            var client = _httpClientFactory.CreateClient("GoogleMaps");
            var url = $"geocode/json?latlng={latitude},{longitude}&key={_apiKey}";

            var response = await client.GetAsync(url);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Google Maps API error: {StatusCode} - {Body}", response.StatusCode, responseBody);
                throw new Exception($"Google Maps API error: {response.StatusCode}");
            }

            var result = JsonSerializer.Deserialize<GoogleMapsGeocodeResponse>(responseBody);

            if (result?.Status != "OK" || result.Results == null || !result.Results.Any())
            {
                throw new Exception($"Reverse geocoding failed: {result?.Status ?? "Unknown error"}");
            }

            var firstResult = result.Results.First();

            // Extract address components
            var city = ExtractAddressComponent(firstResult.AddressComponents, "locality")
                       ?? ExtractAddressComponent(firstResult.AddressComponents, "administrative_area_level_2");
            var state = ExtractAddressComponent(firstResult.AddressComponents, "administrative_area_level_1");
            var postalCode = ExtractAddressComponent(firstResult.AddressComponents, "postal_code");
            var country = ExtractAddressComponent(firstResult.AddressComponents, "country");

            // Cache the result
            var cacheEntry = new LocationCache
            {
                Address = firstResult.FormattedAddress ?? $"{latitude},{longitude}",
                NormalizedAddress = firstResult.FormattedAddress?.Trim().ToLowerInvariant() ?? $"{latitude},{longitude}",
                Latitude = latitude,
                Longitude = longitude,
                FormattedAddress = firstResult.FormattedAddress,
                City = city,
                State = state,
                PostalCode = postalCode,
                Country = country,
                PlaceId = firstResult.PlaceId,
                AddressComponents = JsonSerializer.Serialize(firstResult.AddressComponents)
            };

            await _cacheRepository.CreateAsync(cacheEntry);

            _logger.LogInformation("Reverse geocoded: ({Lat}, {Lng}) -> {Address}", latitude, longitude, firstResult.FormattedAddress);

            return new ReverseGeocodeResponse
            {
                FormattedAddress = firstResult.FormattedAddress ?? "",
                City = city,
                State = state,
                PostalCode = postalCode,
                Country = country,
                PlaceId = firstResult.PlaceId
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error reverse geocoding: ({Lat}, {Lng})", latitude, longitude);
            throw;
        }
    }

    public async Task<DistanceCalculationResponse> CalculateDistanceAsync(string originAddress, string destinationAddress)
    {
        try
        {
            // Geocode both addresses
            var origin = await GeocodeAddressAsync(originAddress);
            var destination = await GeocodeAddressAsync(destinationAddress);

            // Call Google Maps Distance Matrix API
            var client = _httpClientFactory.CreateClient("GoogleMaps");
            var url = $"distancematrix/json?origins={origin.Latitude},{origin.Longitude}&destinations={destination.Latitude},{destination.Longitude}&key={_apiKey}";

            var response = await client.GetAsync(url);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Google Maps API error: {StatusCode} - {Body}", response.StatusCode, responseBody);
                throw new Exception($"Google Maps API error: {response.StatusCode}");
            }

            var result = JsonSerializer.Deserialize<GoogleMapsDistanceMatrixResponse>(responseBody);

            if (result?.Status != "OK" || result.Rows == null || !result.Rows.Any())
            {
                throw new Exception($"Distance calculation failed: {result?.Status ?? "Unknown error"}");
            }

            var element = result.Rows.First().Elements?.FirstOrDefault();
            if (element?.Status != "OK")
            {
                throw new Exception($"Distance calculation failed: {element?.Status ?? "Unknown error"}");
            }

            _logger.LogInformation("Calculated distance: {Origin} -> {Destination} = {Distance}",
                originAddress, destinationAddress, element.Distance?.Text);

            return new DistanceCalculationResponse
            {
                DistanceInMeters = element.Distance?.Value ?? 0,
                DistanceInKilometers = (element.Distance?.Value ?? 0) / 1000.0,
                DistanceText = element.Distance?.Text ?? "",
                DurationInSeconds = element.Duration?.Value ?? 0,
                DurationText = element.Duration?.Text ?? "",
                Origin = origin,
                Destination = destination
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating distance: {Origin} -> {Destination}", originAddress, destinationAddress);
            throw;
        }
    }

    public async Task<HaversineDistanceResponse> CalculateHaversineDistanceAsync(double originLat, double originLon, double destLat, double destLon)
    {
        // Haversine formula to calculate distance between two points on Earth
        const double R = 6371; // Earth's radius in kilometers

        var dLat = ToRadians(destLat - originLat);
        var dLon = ToRadians(destLon - originLon);

        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(ToRadians(originLat)) * Math.Cos(ToRadians(destLat)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        var distanceKm = R * c;

        _logger.LogInformation("Haversine distance: ({OriginLat}, {OriginLon}) -> ({DestLat}, {DestLon}) = {Distance} km",
            originLat, originLon, destLat, destLon, distanceKm);

        return await Task.FromResult(new HaversineDistanceResponse
        {
            DistanceInKilometers = distanceKm,
            DistanceInMeters = distanceKm * 1000,
            DistanceText = $"{distanceKm:F2} km"
        });
    }

    // ========================================================================
    // HELPER METHODS
    // ========================================================================

    private static double ToRadians(double degrees)
    {
        return degrees * Math.PI / 180.0;
    }

    private static string? ExtractAddressComponent(List<GoogleMapsAddressComponent>? components, string type)
    {
        return components?
            .FirstOrDefault(c => c.Types?.Contains(type) == true)?
            .LongName;
    }
}

// ============================================================================
// GOOGLE MAPS API RESPONSE MODELS
// ============================================================================

internal class GoogleMapsGeocodeResponse
{
    public string? Status { get; set; }
    public List<GoogleMapsGeocodeResult>? Results { get; set; }
}

internal class GoogleMapsGeocodeResult
{
    public string? FormattedAddress { get; set; }
    public GoogleMapsGeometry? Geometry { get; set; }
    public string? PlaceId { get; set; }
    public List<GoogleMapsAddressComponent>? AddressComponents { get; set; }
}

internal class GoogleMapsGeometry
{
    public GoogleMapsLocation? Location { get; set; }
}

internal class GoogleMapsLocation
{
    public double Lat { get; set; }
    public double Lng { get; set; }
}

internal class GoogleMapsAddressComponent
{
    public string? LongName { get; set; }
    public string? ShortName { get; set; }
    public List<string>? Types { get; set; }
}

internal class GoogleMapsDistanceMatrixResponse
{
    public string? Status { get; set; }
    public List<GoogleMapsDistanceMatrixRow>? Rows { get; set; }
}

internal class GoogleMapsDistanceMatrixRow
{
    public List<GoogleMapsDistanceMatrixElement>? Elements { get; set; }
}

internal class GoogleMapsDistanceMatrixElement
{
    public string? Status { get; set; }
    public GoogleMapsDistance? Distance { get; set; }
    public GoogleMapsDuration? Duration { get; set; }
}

internal class GoogleMapsDistance
{
    public string? Text { get; set; }
    public int Value { get; set; }
}

internal class GoogleMapsDuration
{
    public string? Text { get; set; }
    public int Value { get; set; }
}
