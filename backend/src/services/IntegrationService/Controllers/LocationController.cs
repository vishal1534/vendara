using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using IntegrationService.Models.Requests;
using IntegrationService.Models.Responses;
using IntegrationService.Services.Interfaces;

namespace IntegrationService.Controllers;

[ApiController]
[Route("api/v1/location")]
public class LocationController : ControllerBase
{
    private readonly IGoogleMapsService _mapsService;
    private readonly ILogger<LocationController> _logger;

    public LocationController(
        IGoogleMapsService mapsService,
        ILogger<LocationController> logger)
    {
        _mapsService = mapsService;
        _logger = logger;
    }

    /// <summary>
    /// Geocode an address to get coordinates
    /// </summary>
    [HttpPost("geocode")]
    [Authorize(Policy = "VendorOrAdmin")]
    public async Task<ActionResult<ApiResponse<GeocodeResponse>>> GeocodeAddress(
        [FromBody] GeocodeAddressRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Address))
            {
                return BadRequest(ApiResponse<GeocodeResponse>.ErrorResponse("Address is required"));
            }

            var result = await _mapsService.GeocodeAddressAsync(request.Address);
            return Ok(ApiResponse<GeocodeResponse>.SuccessResponse(result, "Address geocoded successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error geocoding address");
            return StatusCode(500, ApiResponse<GeocodeResponse>.ErrorResponse("Failed to geocode address"));
        }
    }

    /// <summary>
    /// Reverse geocode coordinates to get address
    /// </summary>
    [HttpPost("reverse-geocode")]
    [Authorize(Policy = "VendorOrAdmin")]
    public async Task<ActionResult<ApiResponse<ReverseGeocodeResponse>>> ReverseGeocode(
        [FromBody] ReverseGeocodeRequest request)
    {
        try
        {
            var result = await _mapsService.ReverseGeocodeAsync(request.Latitude, request.Longitude);
            return Ok(ApiResponse<ReverseGeocodeResponse>.SuccessResponse(result, "Coordinates reverse geocoded successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error reverse geocoding coordinates");
            return StatusCode(500, ApiResponse<ReverseGeocodeResponse>.ErrorResponse("Failed to reverse geocode"));
        }
    }

    /// <summary>
    /// Calculate distance between two addresses
    /// </summary>
    [HttpPost("distance")]
    [Authorize(Policy = "VendorOrAdmin")]
    public async Task<ActionResult<ApiResponse<DistanceCalculationResponse>>> CalculateDistance(
        [FromBody] CalculateDistanceRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.OriginAddress) || string.IsNullOrWhiteSpace(request.DestinationAddress))
            {
                return BadRequest(ApiResponse<DistanceCalculationResponse>.ErrorResponse("Origin and destination addresses are required"));
            }

            var result = await _mapsService.CalculateDistanceAsync(request.OriginAddress, request.DestinationAddress);
            return Ok(ApiResponse<DistanceCalculationResponse>.SuccessResponse(result, "Distance calculated successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating distance");
            return StatusCode(500, ApiResponse<DistanceCalculationResponse>.ErrorResponse("Failed to calculate distance"));
        }
    }

    /// <summary>
    /// Calculate haversine distance using coordinates (no Google Maps API call)
    /// </summary>
    [HttpPost("distance/haversine")]
    [Authorize(Policy = "VendorOrAdmin")]
    public async Task<ActionResult<ApiResponse<HaversineDistanceResponse>>> CalculateHaversineDistance(
        [FromBody] CalculateDistanceByCoordinatesRequest request)
    {
        try
        {
            var result = await _mapsService.CalculateHaversineDistanceAsync(
                request.OriginLatitude,
                request.OriginLongitude,
                request.DestinationLatitude,
                request.DestinationLongitude);

            return Ok(ApiResponse<HaversineDistanceResponse>.SuccessResponse(result, "Haversine distance calculated"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating haversine distance");
            return StatusCode(500, ApiResponse<HaversineDistanceResponse>.ErrorResponse("Failed to calculate distance"));
        }
    }
}
