using RealServ.Shared.Domain.Entities;

namespace CatalogService.Models.Entities;

/// <summary>
/// Tracks price changes for materials and labor services
/// Enables price history analysis and auditing
/// </summary>
public class PriceHistory : BaseEntity
{
    /// <summary>
    /// Type of item (Material or Labor)
    /// </summary>
    public PriceHistoryItemType ItemType { get; set; }

    /// <summary>
    /// ID of the material or labor category
    /// </summary>
    public Guid ItemId { get; set; }

    /// <summary>
    /// Name of the item at time of price change
    /// </summary>
    public string ItemName { get; set; } = string.Empty;

    /// <summary>
    /// Previous price
    /// </summary>
    public decimal OldPrice { get; set; }

    /// <summary>
    /// New price
    /// </summary>
    public decimal NewPrice { get; set; }

    /// <summary>
    /// Price change amount (NewPrice - OldPrice)
    /// </summary>
    public decimal PriceChange { get; set; }

    /// <summary>
    /// Percentage change
    /// </summary>
    public decimal PercentageChange { get; set; }

    /// <summary>
    /// Price type (BasePrice, VendorPrice, HourlyRate, DailyRate)
    /// </summary>
    public string PriceType { get; set; } = string.Empty;

    /// <summary>
    /// Vendor ID if this is a vendor-specific price change (null for base prices)
    /// </summary>
    public Guid? VendorId { get; set; }

    /// <summary>
    /// User who made the change (admin, vendor, system)
    /// </summary>
    public string? ChangedBy { get; set; }

    /// <summary>
    /// Reason for price change (optional)
    /// </summary>
    public string? ChangeReason { get; set; }

    /// <summary>
    /// Timestamp of the price change
    /// </summary>
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
}

public enum PriceHistoryItemType
{
    Material = 1,
    Labor = 2
}
