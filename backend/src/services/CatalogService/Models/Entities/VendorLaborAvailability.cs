using RealServ.Shared.Domain.Entities;

namespace CatalogService.Models.Entities;

/// <summary>
/// Vendor's labor service availability and pricing
/// </summary>
public class VendorLaborAvailability : BaseEntity
{
    /// <summary>
    /// Vendor ID (from Identity Service)
    /// </summary>
    public Guid VendorId { get; set; }

    /// <summary>
    /// Labor category ID
    /// </summary>
    public Guid LaborCategoryId { get; set; }

    /// <summary>
    /// Is this service available from this vendor?
    /// </summary>
    public bool IsAvailable { get; set; } = true;

    /// <summary>
    /// Vendor's hourly rate (can differ from base rate)
    /// </summary>
    public decimal HourlyRate { get; set; }

    /// <summary>
    /// Vendor's daily rate (8 hours)
    /// </summary>
    public decimal DailyRate { get; set; }

    /// <summary>
    /// Number of workers available
    /// </summary>
    public int AvailableWorkers { get; set; } = 1;

    /// <summary>
    /// Lead time in days for service
    /// </summary>
    public int LeadTimeDays { get; set; } = 1;

    /// <summary>
    /// Last updated timestamp
    /// </summary>
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public LaborCategory LaborCategory { get; set; } = null!;
}
