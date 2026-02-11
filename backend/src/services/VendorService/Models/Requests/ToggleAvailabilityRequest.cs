using System.ComponentModel.DataAnnotations;

namespace VendorService.Models.Requests;

/// <summary>
/// Request to toggle vendor availability
/// </summary>
public class ToggleAvailabilityRequest
{
    [Required]
    public bool IsAvailable { get; set; }
}
