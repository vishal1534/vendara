using System.ComponentModel.DataAnnotations;
using VendorService.Models.Enums;

namespace VendorService.Models.Requests;

/// <summary>
/// Request to upload vendor document
/// </summary>
public class CreateDocumentRequest
{
    [Required]
    public DocumentType DocumentType { get; set; }
    
    [Required]
    [StringLength(50)]
    public string DocumentNumber { get; set; } = string.Empty;
    
    [Required]
    [Url]
    [StringLength(500)]
    public string FileUrl { get; set; } = string.Empty;
    
    [StringLength(200)]
    public string? FileName { get; set; }
    
    public long? FileSize { get; set; }
    
    [StringLength(100)]
    public string? MimeType { get; set; }
    
    public DateTime? ExpiryDate { get; set; }
    
    [StringLength(500)]
    public string? Notes { get; set; }
}
