namespace VendorService.Models.Entities;

/// <summary>
/// Labor categories and workers that a vendor provides
/// Links to Catalog Service labor categories
/// </summary>
public class VendorLaborAvailability
{
    public Guid Id { get; set; }
    public Guid VendorId { get; set; }
    public Guid LaborCategoryId { get; set; } // Links to Catalog Service
    
    // Worker Details
    public int AvailableWorkers { get; set; }
    public int SkillLevel { get; set; } // 1=Helper, 2=Skilled, 3=Expert
    
    // Pricing
    public decimal HourlyRate { get; set; }
    public decimal DailyRate { get; set; }
    public decimal? WeeklyRate { get; set; }
    public decimal? MonthlyRate { get; set; }
    public decimal? OvertimeRate { get; set; }
    
    // Availability
    public bool IsAvailable { get; set; } = true;
    public DateTime? AvailableFrom { get; set; }
    public DateTime? AvailableUntil { get; set; }
    public int? MinimumBookingHours { get; set; }
    public int? MaximumBookingDays { get; set; }
    
    // Experience and Certifications
    public int? YearsOfExperience { get; set; }
    public string? Certifications { get; set; } // Comma-separated
    public string? SpecialSkills { get; set; }
    public string? LanguagesSpoken { get; set; }
    
    // Additional Info
    public string? Notes { get; set; }
    public bool ProvideTools { get; set; }
    public bool ProvideSafetyEquipment { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation
    public Vendor Vendor { get; set; } = null!;
}
