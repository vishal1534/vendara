namespace OrderService.Models.Entities;

/// <summary>
/// Order labor entity representing a labor booking in an order
/// </summary>
public class OrderLabor
{
    /// <summary>
    /// Unique order labor identifier
    /// </summary>
    public Guid Id { get; set; }
    
    /// <summary>
    /// Parent order ID
    /// </summary>
    public Guid OrderId { get; set; }
    
    /// <summary>
    /// Parent order reference
    /// </summary>
    public Order Order { get; set; } = null!;
    
    /// <summary>
    /// Labor category ID from Catalog Service
    /// </summary>
    public Guid LaborCategoryId { get; set; }
    
    /// <summary>
    /// Vendor labor availability ID (specific vendor's offering)
    /// </summary>
    public Guid VendorLaborAvailabilityId { get; set; }
    
    /// <summary>
    /// Labor category name (snapshot at order time)
    /// </summary>
    public string LaborCategoryName { get; set; } = string.Empty;
    
    /// <summary>
    /// Skill level (1=Helper, 2=Skilled, 3=Expert)
    /// </summary>
    public int SkillLevel { get; set; }
    
    /// <summary>
    /// Number of workers required
    /// </summary>
    public int WorkerCount { get; set; }
    
    /// <summary>
    /// Hourly rate at booking time
    /// </summary>
    public decimal HourlyRate { get; set; }
    
    /// <summary>
    /// Daily rate at booking time
    /// </summary>
    public decimal DailyRate { get; set; }
    
    /// <summary>
    /// Booking start date
    /// </summary>
    public DateTime StartDate { get; set; }
    
    /// <summary>
    /// Booking end date
    /// </summary>
    public DateTime EndDate { get; set; }
    
    /// <summary>
    /// Number of hours booked (for hourly bookings)
    /// </summary>
    public int? HoursBooked { get; set; }
    
    /// <summary>
    /// Number of days booked (for daily bookings)
    /// </summary>
    public int? DaysBooked { get; set; }
    
    /// <summary>
    /// Total amount for labor booking
    /// </summary>
    public decimal TotalAmount { get; set; }
    
    /// <summary>
    /// Labor requirements/notes
    /// </summary>
    public string? Requirements { get; set; }
    
    /// <summary>
    /// Labor booking created timestamp
    /// </summary>
    public DateTime CreatedAt { get; set; }
}
