using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IntegrationService.Models.Entities;

/// <summary>
/// Media file entity for tracking uploaded files
/// </summary>
[Table("media_files")]
public class MediaFile
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>
    /// Original filename uploaded by user
    /// </summary>
    [Required]
    [Column("original_filename")]
    [MaxLength(255)]
    public string OriginalFilename { get; set; } = string.Empty;

    /// <summary>
    /// Storage filename (unique) in S3
    /// </summary>
    [Required]
    [Column("storage_filename")]
    [MaxLength(255)]
    public string StorageFilename { get; set; } = string.Empty;

    /// <summary>
    /// S3 bucket name
    /// </summary>
    [Required]
    [Column("bucket_name")]
    [MaxLength(100)]
    public string BucketName { get; set; } = string.Empty;

    /// <summary>
    /// S3 object key (path in bucket)
    /// </summary>
    [Required]
    [Column("s3_key")]
    [MaxLength(500)]
    public string S3Key { get; set; } = string.Empty;

    /// <summary>
    /// Public URL to access the file
    /// </summary>
    [Required]
    [Column("url")]
    [MaxLength(1000)]
    public string Url { get; set; } = string.Empty;

    /// <summary>
    /// MIME type of the file
    /// </summary>
    [Required]
    [Column("mime_type")]
    [MaxLength(100)]
    public string MimeType { get; set; } = string.Empty;

    /// <summary>
    /// File size in bytes
    /// </summary>
    [Column("file_size")]
    public long FileSize { get; set; }

    /// <summary>
    /// File category: image, document, video, audio
    /// </summary>
    [Required]
    [Column("category")]
    [MaxLength(50)]
    public string Category { get; set; } = string.Empty;

    /// <summary>
    /// Upload context: profile_photo, kyc_document, product_image, etc.
    /// </summary>
    [Column("upload_context")]
    [MaxLength(100)]
    public string? UploadContext { get; set; }

    /// <summary>
    /// User ID who uploaded the file
    /// </summary>
    [Column("uploaded_by_user_id")]
    [MaxLength(50)]
    public string? UploadedByUserId { get; set; }

    /// <summary>
    /// User type: vendor, buyer, admin
    /// </summary>
    [Column("uploaded_by_user_type")]
    [MaxLength(20)]
    public string? UploadedByUserType { get; set; }

    /// <summary>
    /// Related entity ID (vendor ID, product ID, order ID, etc.)
    /// </summary>
    [Column("related_entity_id")]
    [MaxLength(50)]
    public string? RelatedEntityId { get; set; }

    /// <summary>
    /// Related entity type (vendor, product, order, etc.)
    /// </summary>
    [Column("related_entity_type")]
    [MaxLength(50)]
    public string? RelatedEntityType { get; set; }

    /// <summary>
    /// Whether file is publicly accessible
    /// </summary>
    [Column("is_public")]
    public bool IsPublic { get; set; } = true;

    /// <summary>
    /// Additional metadata as JSON
    /// </summary>
    [Column("metadata", TypeName = "jsonb")]
    public string? Metadata { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Soft delete timestamp
    /// </summary>
    [Column("deleted_at")]
    public DateTime? DeletedAt { get; set; }
}
