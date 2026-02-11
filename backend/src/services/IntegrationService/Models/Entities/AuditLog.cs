using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IntegrationService.Models.Entities;

/// <summary>
/// Audit log for tracking sensitive operations (WhatsApp sends, file uploads, etc.)
/// </summary>
[Table("audit_logs")]
public class AuditLog
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>
    /// User who performed the action (Firebase UID or User ID)
    /// </summary>
    [Column("user_id")]
    [MaxLength(100)]
    public string? UserId { get; set; }

    /// <summary>
    /// Type of user (buyer, vendor, admin)
    /// </summary>
    [Column("user_type")]
    [MaxLength(50)]
    public string? UserType { get; set; }

    /// <summary>
    /// Action performed (e.g., "WhatsAppMessageSent", "FileUploaded", "LocationGeocoded")
    /// </summary>
    [Column("action")]
    [Required]
    [MaxLength(100)]
    public string Action { get; set; } = string.Empty;

    /// <summary>
    /// Entity type affected (e.g., "Order", "Payment", "Dispute", "Media")
    /// </summary>
    [Column("entity_type")]
    [MaxLength(100)]
    public string? EntityType { get; set; }

    /// <summary>
    /// Entity ID affected
    /// </summary>
    [Column("entity_id")]
    [MaxLength(100)]
    public string? EntityId { get; set; }

    /// <summary>
    /// Additional metadata (JSON format)
    /// e.g., {"phoneNumber": "+917906441952", "messageLength": 120}
    /// </summary>
    [Column("metadata", TypeName = "jsonb")]
    public string? Metadata { get; set; }

    /// <summary>
    /// IP address of the request
    /// </summary>
    [Column("ip_address")]
    [MaxLength(45)] // IPv6 max length
    public string? IpAddress { get; set; }

    /// <summary>
    /// User agent string
    /// </summary>
    [Column("user_agent")]
    [MaxLength(500)]
    public string? UserAgent { get; set; }

    /// <summary>
    /// Result of the action (Success, Failed, PartialSuccess)
    /// </summary>
    [Column("result")]
    [MaxLength(50)]
    public string Result { get; set; } = "Success";

    /// <summary>
    /// Error message if action failed
    /// </summary>
    [Column("error_message")]
    [MaxLength(1000)]
    public string? ErrorMessage { get; set; }

    /// <summary>
    /// When the action was performed
    /// </summary>
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
