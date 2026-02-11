using Microsoft.AspNetCore.Mvc;
using NotificationService.Models.Requests;
using NotificationService.Models.Responses;
using NotificationService.Services.Interfaces;

namespace NotificationService.Controllers;

[ApiController]
[Route("api/v1/notifications/preferences")]
public class PreferenceController : ControllerBase
{
    private readonly IUserNotificationPreferenceService _preferenceService;
    private readonly ILogger<PreferenceController> _logger;

    public PreferenceController(
        IUserNotificationPreferenceService preferenceService,
        ILogger<PreferenceController> logger)
    {
        _preferenceService = preferenceService;
        _logger = logger;
    }

    /// <summary>
    /// Get user notification preferences
    /// </summary>
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetPreferences(Guid userId)
    {
        try
        {
            var preferences = await _preferenceService.GetOrCreatePreferencesAsync(userId);
            return Ok(preferences);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving preferences for user {UserId}", userId);
            return StatusCode(500, new ErrorResponse
            {
                Error = "Failed to retrieve preferences",
                Details = ex.Message
            });
        }
    }

    /// <summary>
    /// Update user notification preferences
    /// </summary>
    [HttpPut("{userId}")]
    public async Task<IActionResult> UpdatePreferences(Guid userId, [FromBody] UpdatePreferencesRequest request)
    {
        try
        {
            var preferences = await _preferenceService.UpdatePreferencesAsync(userId, request);
            return Ok(preferences);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ErrorResponse { Error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating preferences for user {UserId}", userId);
            return StatusCode(500, new ErrorResponse
            {
                Error = "Failed to update preferences",
                Details = ex.Message
            });
        }
    }
}
