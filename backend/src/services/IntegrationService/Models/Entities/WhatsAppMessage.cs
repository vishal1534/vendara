using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IntegrationService.Models.Entities;

/// <summary>
/// WhatsApp message entity for tracking sent and received messages
/// </summary>
[Table("whatsapp_messages")]
public class WhatsAppMessage
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>
    /// WhatsApp message ID from Meta API
    /// </summary>
    [Column("whatsapp_message_id")]
    [MaxLength(255)]
    public string? WhatsAppMessageId { get; set; }

    /// <summary>
    /// Direction: inbound or outbound
    /// </summary>
    [Required]
    [Column("direction")]
    [MaxLength(20)]
    public string Direction { get; set; } = string.Empty; // "inbound", "outbound"

    /// <summary>
    /// Message type: text, image, document, location, etc.
    /// </summary>
    [Required]
    [Column("message_type")]
    [MaxLength(50)]
    public string MessageType { get; set; } = string.Empty;

    /// <summary>
    /// Phone number in E.164 format (e.g., +917906441952)
    /// </summary>
    [Required]
    [Column("phone_number")]
    [MaxLength(20)]
    public string PhoneNumber { get; set; } = string.Empty;

    /// <summary>
    /// User ID (vendor or buyer) if linked
    /// </summary>
    [Column("user_id")]
    [MaxLength(50)]
    public string? UserId { get; set; }

    /// <summary>
    /// User type: vendor, buyer, admin
    /// </summary>
    [Column("user_type")]
    [MaxLength(20)]
    public string? UserType { get; set; }

    /// <summary>
    /// Message content (text)
    /// </summary>
    [Column("content")]
    public string? Content { get; set; }

    /// <summary>
    /// Media URL if message contains media
    /// </summary>
    [Column("media_url")]
    [MaxLength(500)]
    public string? MediaUrl { get; set; }

    /// <summary>
    /// Media type: image, video, document, audio
    /// </summary>
    [Column("media_type")]
    [MaxLength(50)]
    public string? MediaType { get; set; }

    /// <summary>
    /// Caption for media messages
    /// </summary>
    [Column("caption")]
    [MaxLength(1000)]
    public string? Caption { get; set; }

    /// <summary>
    /// Delivery status: sent, delivered, read, failed
    /// </summary>
    [Column("status")]
    [MaxLength(20)]
    public string Status { get; set; } = "sent";

    /// <summary>
    /// Error message if delivery failed
    /// </summary>
    [Column("error_message")]
    public string? ErrorMessage { get; set; }

    /// <summary>
    /// Message context (what triggered this message)
    /// </summary>
    [Column("context")]
    [MaxLength(100)]
    public string? Context { get; set; } // e.g., "order_update", "catalog_inquiry"

    /// <summary>
    /// Related entity ID (order ID, catalog item ID, etc.)
    /// </summary>
    [Column("related_entity_id")]
    [MaxLength(50)]
    public string? RelatedEntityId { get; set; }

    /// <summary>
    /// Related entity type (order, catalog_item, etc.)
    /// </summary>
    [Column("related_entity_type")]
    [MaxLength(50)]
    public string? RelatedEntityType { get; set; }

    /// <summary>
    /// Additional metadata as JSON
    /// </summary>
    [Column("metadata", TypeName = "jsonb")]
    public string? Metadata { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
