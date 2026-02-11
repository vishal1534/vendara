namespace IntegrationService.Models.Responses;

/// <summary>
/// Response for media file upload
/// </summary>
public class MediaUploadResponse
{
    public Guid FileId { get; set; }
    public string OriginalFilename { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string MimeType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string Category { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; }
}

/// <summary>
/// Response for multiple media file uploads
/// </summary>
public class MultipleMediaUploadResponse
{
    public List<MediaUploadResponse> Files { get; set; } = new();
    public int SuccessCount { get; set; }
    public int FailureCount { get; set; }
    public List<string>? Errors { get; set; }
}

/// <summary>
/// Response for media file details
/// </summary>
public class MediaFileDetailsResponse
{
    public Guid FileId { get; set; }
    public string OriginalFilename { get; set; } = string.Empty;
    public string StorageFilename { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string MimeType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string Category { get; set; } = string.Empty;
    public string? UploadContext { get; set; }
    public string? UploadedByUserId { get; set; }
    public string? UploadedByUserType { get; set; }
    public string? RelatedEntityId { get; set; }
    public string? RelatedEntityType { get; set; }
    public bool IsPublic { get; set; }
    public DateTime CreatedAt { get; set; }
}
