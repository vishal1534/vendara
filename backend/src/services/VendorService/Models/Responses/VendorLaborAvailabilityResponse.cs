namespace VendorService.Models.Responses;

/// <summary>
/// Vendor labor availability response DTO
/// </summary>
public class VendorLaborAvailabilityResponse
{
    public Guid Id { get; set; }
    public Guid VendorId { get; set; }
    public Guid LaborCategoryId { get; set; }
    
    public int AvailableWorkers { get; set; }
    public int SkillLevel { get; set; }
    
    public decimal HourlyRate { get; set; }
    public decimal DailyRate { get; set; }
    public decimal? WeeklyRate { get; set; }
    public decimal? MonthlyRate { get; set; }
    public decimal? OvertimeRate { get; set; }
    
    public bool IsAvailable { get; set; }
    public DateTime? AvailableFrom { get; set; }
    public DateTime? AvailableUntil { get; set; }
    public int? MinimumBookingHours { get; set; }
    
    public int? YearsOfExperience { get; set; }
    public string? Certifications { get; set; }
    public string? SpecialSkills { get; set; }
    public string? LanguagesSpoken { get; set; }
    
    public bool ProvideTools { get; set; }
    public bool ProvideSafetyEquipment { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
