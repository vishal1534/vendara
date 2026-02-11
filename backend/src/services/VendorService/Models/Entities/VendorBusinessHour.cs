using VendorService.Models.Enums;

namespace VendorService.Models.Entities;

/// <summary>
/// Vendor operating hours for each day of the week
/// </summary>
public class VendorBusinessHour
{
    public Guid Id { get; set; }
    public Guid VendorId { get; set; }
    
    public DayOfWeekEnum DayOfWeek { get; set; }
    public bool IsOpen { get; set; } = true;
    public TimeSpan OpenTime { get; set; } // e.g., 09:00:00
    public TimeSpan CloseTime { get; set; } // e.g., 18:00:00
    
    public bool HasBreak { get; set; }
    public TimeSpan? BreakStartTime { get; set; }
    public TimeSpan? BreakEndTime { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation
    public Vendor Vendor { get; set; } = null!;
}
