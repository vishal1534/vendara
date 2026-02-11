using System.ComponentModel.DataAnnotations;

namespace VendorService.Models.Requests;

/// <summary>
/// Request to add labor availability
/// </summary>
public class CreateLaborAvailabilityRequest
{
    [Required]
    public Guid LaborCategoryId { get; set; }
    
    [Required]
    [Range(1, 1000)]
    public int AvailableWorkers { get; set; }
    
    [Required]
    [Range(1, 3)]
    public int SkillLevel { get; set; } // 1=Helper, 2=Skilled, 3=Expert
    
    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal HourlyRate { get; set; }
    
    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal DailyRate { get; set; }
    
    public decimal? WeeklyRate { get; set; }
    public decimal? MonthlyRate { get; set; }
    public decimal? OvertimeRate { get; set; }
    
    public DateTime? AvailableFrom { get; set; }
    public DateTime? AvailableUntil { get; set; }
    
    [Range(1, 24)]
    public int? MinimumBookingHours { get; set; }
    
    [Range(1, 365)]
    public int? MaximumBookingDays { get; set; }
    
    [Range(0, 50)]
    public int? YearsOfExperience { get; set; }
    
    [StringLength(500)]
    public string? Certifications { get; set; }
    
    [StringLength(500)]
    public string? SpecialSkills { get; set; }
    
    [StringLength(200)]
    public string? LanguagesSpoken { get; set; }
    
    public bool ProvideTools { get; set; }
    public bool ProvideSafetyEquipment { get; set; }
    
    [StringLength(500)]
    public string? Notes { get; set; }
}
