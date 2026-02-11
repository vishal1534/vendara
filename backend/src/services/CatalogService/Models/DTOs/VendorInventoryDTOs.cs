namespace CatalogService.Models.DTOs;

public class VendorInventoryDto
{
    public Guid Id { get; set; }
    public Guid VendorId { get; set; }
    public Guid MaterialId { get; set; }
    public string MaterialName { get; set; } = string.Empty;
    public string MaterialUnit { get; set; } = string.Empty;
    public bool IsAvailable { get; set; }
    public decimal VendorPrice { get; set; }
    public decimal StockQuantity { get; set; }
    public decimal MinOrderQuantity { get; set; }
    public decimal? MaxOrderQuantity { get; set; }
    public int LeadTimeDays { get; set; }
    public DateTime? LastRestockedAt { get; set; }
}

public class CreateVendorInventoryRequest
{
    public Guid VendorId { get; set; }
    public Guid MaterialId { get; set; }
    public bool IsAvailable { get; set; } = true;
    public decimal VendorPrice { get; set; }
    public decimal StockQuantity { get; set; } = 0;
    public decimal? MinOrderQuantity { get; set; }
    public decimal? MaxOrderQuantity { get; set; }
    public int LeadTimeDays { get; set; } = 1;
}

public class UpdateVendorInventoryRequest
{
    public bool? IsAvailable { get; set; }
    public decimal? VendorPrice { get; set; }
    public decimal? StockQuantity { get; set; }
    public decimal? MinOrderQuantity { get; set; }
    public decimal? MaxOrderQuantity { get; set; }
    public int? LeadTimeDays { get; set; }
}

public class VendorLaborAvailabilityDto
{
    public Guid Id { get; set; }
    public Guid VendorId { get; set; }
    public Guid LaborCategoryId { get; set; }
    public string LaborCategoryName { get; set; } = string.Empty;
    public bool IsAvailable { get; set; }
    public decimal HourlyRate { get; set; }
    public decimal DailyRate { get; set; }
    public int AvailableWorkers { get; set; }
    public int MinBookingHours { get; set; }
}

public class CreateVendorLaborAvailabilityRequest
{
    public Guid VendorId { get; set; }
    public Guid LaborCategoryId { get; set; }
    public bool IsAvailable { get; set; } = true;
    public decimal HourlyRate { get; set; }
    public decimal DailyRate { get; set; }
    public int AvailableWorkers { get; set; } = 1;
    public int MinBookingHours { get; set; } = 4;
}

public class UpdateVendorLaborAvailabilityRequest
{
    public bool? IsAvailable { get; set; }
    public decimal? HourlyRate { get; set; }
    public decimal? DailyRate { get; set; }
    public int? AvailableWorkers { get; set; }
    public int? MinBookingHours { get; set; }
}