using Microsoft.AspNetCore.Http;

namespace IntegrationService.Models.Requests;

/// <summary>
/// Request to upload a media file
/// </summary>
public class UploadMediaRequest
{
    public IFormFile File { get; set; } = null!;
    public string? UploadContext { get; set; }
    public string? UploadedByUserId { get; set; }
    public string? UploadedByUserType { get; set; }
    public string? RelatedEntityId { get; set; }
    public string? RelatedEntityType { get; set; }
    public bool IsPublic { get; set; } = true;
}

/// <summary>
/// Request to upload multiple media files
/// </summary>
public class UploadMultipleMediaRequest
{
    public List<IFormFile> Files { get; set; } = new();
    public string? UploadContext { get; set; }
    public string? UploadedByUserId { get; set; }
    public string? UploadedByUserType { get; set; }
    public string? RelatedEntityId { get; set; }
    public string? RelatedEntityType { get; set; }
    public bool IsPublic { get; set; } = true;
}
