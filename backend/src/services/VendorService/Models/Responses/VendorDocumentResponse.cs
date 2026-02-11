using VendorService.Models.Enums;

namespace VendorService.Models.Responses;

/// <summary>
/// Vendor document response DTO
/// </summary>
public class VendorDocumentResponse
{
    public Guid Id { get; set; }
    public Guid VendorId { get; set; }
    
    public DocumentType DocumentType { get; set; }
    public string DocumentNumber { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public string? FileName { get; set; }
    public long? FileSize { get; set; }
    
    public DocumentStatus Status { get; set; }
    public DateTime? VerifiedAt { get; set; }
    public string? RejectionReason { get; set; }
    
    public DateTime? ExpiryDate { get; set; }
    public DateTime UploadedAt { get; set; }
}
