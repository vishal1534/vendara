namespace CatalogService.Models.DTOs;

public class MaterialDto
{
    public Guid Id { get; set; }
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Sku { get; set; }
    public decimal BasePrice { get; set; }
    public string Unit { get; set; } = string.Empty;
    public decimal MinOrderQuantity { get; set; }
    public decimal? MaxOrderQuantity { get; set; }
    public string? ImageUrl { get; set; }
    public string? Brand { get; set; }
    public string? Specifications { get; set; }
    public string? HsnCode { get; set; }
    public decimal GstPercentage { get; set; }
    public bool IsActive { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsPopular { get; set; }
    public List<string> Tags { get; set; } = new();
    
    // Calculated fields
    public int AvailableVendors { get; set; }
    public decimal? AverageVendorPrice { get; set; }
    public bool InStock { get; set; }
    public int? StockLevel { get; set; }
}

public class CreateMaterialRequest
{
    public Guid CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Sku { get; set; }
    public decimal BasePrice { get; set; }
    public string Unit { get; set; } = string.Empty;
    public decimal MinOrderQuantity { get; set; } = 1;
    public decimal? MaxOrderQuantity { get; set; }
    public string? ImageUrl { get; set; }
    public string? Brand { get; set; }
    public string? Specifications { get; set; }
    public string? HsnCode { get; set; }
    public decimal GstPercentage { get; set; } = 18;
    public int DisplayOrder { get; set; } = 0;
    public bool IsPopular { get; set; } = false;
    public List<string> Tags { get; set; } = new();
}

public class UpdateMaterialRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal? BasePrice { get; set; }
    public decimal? MinOrderQuantity { get; set; }
    public decimal? MaxOrderQuantity { get; set; }
    public string? ImageUrl { get; set; }
    public string? Brand { get; set; }
    public string? Specifications { get; set; }
    public decimal? GstPercentage { get; set; }
    public bool? IsActive { get; set; }
    public int? DisplayOrder { get; set; }
    public bool? IsPopular { get; set; }
    public List<string>? Tags { get; set; }
}