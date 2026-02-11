using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IntegrationService.Models.Entities;

/// <summary>
/// Location cache for geocoding and distance calculation results
/// </summary>
[Table("location_cache")]
public class LocationCache
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>
    /// Address string that was geocoded
    /// </summary>
    [Required]
    [Column("address")]
    [MaxLength(500)]
    public string Address { get; set; } = string.Empty;

    /// <summary>
    /// Normalized address (lowercase, trimmed)
    /// </summary>
    [Required]
    [Column("normalized_address")]
    [MaxLength(500)]
    public string NormalizedAddress { get; set; } = string.Empty;

    /// <summary>
    /// Latitude from geocoding
    /// </summary>
    [Required]
    [Column("latitude")]
    public double Latitude { get; set; }

    /// <summary>
    /// Longitude from geocoding
    /// </summary>
    [Required]
    [Column("longitude")]
    public double Longitude { get; set; }

    /// <summary>
    /// Formatted address from Google Maps
    /// </summary>
    [Column("formatted_address")]
    [MaxLength(500)]
    public string? FormattedAddress { get; set; }

    /// <summary>
    /// City name
    /// </summary>
    [Column("city")]
    [MaxLength(100)]
    public string? City { get; set; }

    /// <summary>
    /// State name
    /// </summary>
    [Column("state")]
    [MaxLength(100)]
    public string? State { get; set; }

    /// <summary>
    /// Postal code
    /// </summary>
    [Column("postal_code")]
    [MaxLength(20)]
    public string? PostalCode { get; set; }

    /// <summary>
    /// Country name
    /// </summary>
    [Column("country")]
    [MaxLength(100)]
    public string? Country { get; set; }

    /// <summary>
    /// Place ID from Google Maps
    /// </summary>
    [Column("place_id")]
    [MaxLength(255)]
    public string? PlaceId { get; set; }

    /// <summary>
    /// Additional components from Google Maps as JSON
    /// </summary>
    [Column("address_components", TypeName = "jsonb")]
    public string? AddressComponents { get; set; }

    /// <summary>
    /// Number of times this cache entry has been used
    /// </summary>
    [Column("hit_count")]
    public int HitCount { get; set; } = 1;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Last time this cache entry was accessed
    /// </summary>
    [Column("last_accessed_at")]
    public DateTime LastAccessedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Expiry date for cache invalidation (90 days default)
    /// </summary>
    [Column("expires_at")]
    public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddDays(90);
}
