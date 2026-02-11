using System.ComponentModel.DataAnnotations;
using VendorService.Models.Enums;

namespace VendorService.Models.Requests;

/// <summary>
/// Single business hour entry
/// </summary>
public class BusinessHourEntry
{
    [Required]
    public DayOfWeekEnum DayOfWeek { get; set; }
    
    public bool IsOpen { get; set; } = true;
    
    [Required]
    public TimeSpan OpenTime { get; set; }
    
    [Required]
    public TimeSpan CloseTime { get; set; }
    
    public bool HasBreak { get; set; }
    public TimeSpan? BreakStartTime { get; set; }
    public TimeSpan? BreakEndTime { get; set; }
}

/// <summary>
/// Request to update business hours (bulk update)
/// </summary>
public class UpdateBusinessHoursRequest
{
    [Required]
    [MinLength(1)]
    [MaxLength(7)]
    public List<BusinessHourEntry> Hours { get; set; } = new();
}
