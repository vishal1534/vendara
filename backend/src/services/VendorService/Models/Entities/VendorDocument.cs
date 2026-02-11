using VendorService.Models.Enums;

namespace VendorService.Models.Entities;

/// <summary>
/// Vendor KYC/verification documents
/// </summary>
public class VendorDocument
{
    public Guid Id { get; set; }
    public Guid VendorId { get; set; }
    
    public DocumentType DocumentType { get; set; }
    public string DocumentNumber { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public string? FileName { get; set; }
    public long? FileSize { get; set; }
    public string? MimeType { get; set; }
    
    public DocumentStatus Status { get; set; } = DocumentStatus.Pending;
    public DateTime? VerifiedAt { get; set; }
    public Guid? VerifiedBy { get; set; }
    public string? RejectionReason { get; set; }
    public string? Notes { get; set; }
    
    public DateTime? ExpiryDate { get; set; }
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation
    public Vendor Vendor { get; set; } = null!;
}
