using VendorService.Models.Enums;

namespace VendorService.Models.Responses;

/// <summary>
/// Vendor business hours response DTO
/// </summary>
public class VendorBusinessHourResponse
{
    public Guid Id { get; set; }
    public Guid VendorId { get; set; }
    
    public DayOfWeekEnum DayOfWeek { get; set; }
    public bool IsOpen { get; set; }
    public TimeSpan OpenTime { get; set; }
    public TimeSpan CloseTime { get; set; }
    
    public bool HasBreak { get; set; }
    public TimeSpan? BreakStartTime { get; set; }
    public TimeSpan? BreakEndTime { get; set; }
}
