using RealServ.Shared.Domain.Entities;

namespace CatalogService.Models.Entities;

/// <summary>
/// Labor/service category (mason, carpenter, electrician, plumber, etc.)
/// </summary>
public class LaborCategory : BaseEntity
{
    /// <summary>
    /// Parent category ID
    /// </summary>
    public Guid CategoryId { get; set; }

    /// <summary>
    /// Labor category name (e.g., "Mason", "Carpenter", "Electrician")
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Description of services provided
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Base hourly rate (platform-wide reference price)
    /// </summary>
    public decimal BaseHourlyRate { get; set; }

    /// <summary>
    /// Base daily rate (8 hours)
    /// </summary>
    public decimal BaseDailyRate { get; set; }

    /// <summary>
    /// Skill level: Helper, Skilled, Expert
    /// </summary>
    public SkillLevel SkillLevel { get; set; }

    /// <summary>
    /// Icon URL
    /// </summary>
    public string? IconUrl { get; set; }

    /// <summary>
    /// Is this labor category active?
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Display order for UI
    /// </summary>
    public int DisplayOrder { get; set; }

    /// <summary>
    /// Is this a popular/featured labor service?
    /// </summary>
    public bool IsPopular { get; set; } = false;

    /// <summary>
    /// Tags for search and filtering (JSON array stored as string)
    /// </summary>
    public string? Tags { get; set; }

    /// <summary>
    /// Minimum experience required in years
    /// </summary>
    public int? MinimumExperienceYears { get; set; }

    /// <summary>
    /// Is certification required for this labor category?
    /// </summary>
    public bool CertificationRequired { get; set; } = false;

    // Navigation properties
    public Category Category { get; set; } = null!;
    public ICollection<VendorLaborAvailability> VendorLaborAvailabilities { get; set; } = new List<VendorLaborAvailability>();
}

public enum SkillLevel
{
    Helper = 1,
    Skilled = 2,
    Expert = 3
}