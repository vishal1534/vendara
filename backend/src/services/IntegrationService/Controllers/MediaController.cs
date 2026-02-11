using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using IntegrationService.Models.Requests;
using IntegrationService.Models.Responses;
using IntegrationService.Services.Interfaces;

namespace IntegrationService.Controllers;

[ApiController]
[Route("api/v1/media")]
public class MediaController : ControllerBase
{
    private readonly IMediaUploadService _mediaService;
    private readonly ILogger<MediaController> _logger;

    public MediaController(
        IMediaUploadService mediaService,
        ILogger<MediaController> logger)
    {
        _mediaService = mediaService;
        _logger = logger;
    }

    /// <summary>
    /// Upload a single file to S3
    /// </summary>
    [HttpPost("upload")]
    [Authorize(Policy = "VendorOrAdmin")]
    [RequestFormLimits(MultipartBodyLengthLimit = 104857600)] // 100 MB
    [RequestSizeLimit(104857600)] // 100 MB
    public async Task<ActionResult<ApiResponse<MediaUploadResponse>>> UploadFile(
        [FromForm] IFormFile file,
        [FromForm] string? uploadContext = null,
        [FromForm] string? uploadedByUserId = null,
        [FromForm] string? uploadedByUserType = null,
        [FromForm] string? relatedEntityId = null,
        [FromForm] string? relatedEntityType = null,
        [FromForm] bool isPublic = true)
    {
        try
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(ApiResponse<MediaUploadResponse>.ErrorResponse("No file provided"));
            }

            var request = new UploadMediaRequest
            {
                File = file,
                UploadContext = uploadContext,
                UploadedByUserId = uploadedByUserId,
                UploadedByUserType = uploadedByUserType,
                RelatedEntityId = relatedEntityId,
                RelatedEntityType = relatedEntityType,
                IsPublic = isPublic
            };

            var result = await _mediaService.UploadFileAsync(file, request);
            return Ok(ApiResponse<MediaUploadResponse>.SuccessResponse(result, "File uploaded successfully"));
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid file upload request");
            return BadRequest(ApiResponse<MediaUploadResponse>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading file");
            return StatusCode(500, ApiResponse<MediaUploadResponse>.ErrorResponse("Failed to upload file"));
        }
    }

    /// <summary>
    /// Upload multiple files to S3
    /// </summary>
    [HttpPost("upload/multiple")]
    [Authorize(Policy = "VendorOrAdmin")]
    [RequestFormLimits(MultipartBodyLengthLimit = 104857600)] // 100 MB
    [RequestSizeLimit(104857600)] // 100 MB
    public async Task<ActionResult<ApiResponse<MultipleMediaUploadResponse>>> UploadMultipleFiles(
        [FromForm] List<IFormFile> files,
        [FromForm] string? uploadContext = null,
        [FromForm] string? uploadedByUserId = null,
        [FromForm] string? uploadedByUserType = null,
        [FromForm] string? relatedEntityId = null,
        [FromForm] string? relatedEntityType = null,
        [FromForm] bool isPublic = true)
    {
        try
        {
            if (files == null || !files.Any())
            {
                return BadRequest(ApiResponse<MultipleMediaUploadResponse>.ErrorResponse("No files provided"));
            }

            var request = new UploadMultipleMediaRequest
            {
                Files = files,
                UploadContext = uploadContext,
                UploadedByUserId = uploadedByUserId,
                UploadedByUserType = uploadedByUserType,
                RelatedEntityId = relatedEntityId,
                RelatedEntityType = relatedEntityType,
                IsPublic = isPublic
            };

            var result = await _mediaService.UploadMultipleFilesAsync(files, request);
            
            var message = result.FailureCount > 0
                ? $"{result.SuccessCount} files uploaded, {result.FailureCount} failed"
                : $"{result.SuccessCount} files uploaded successfully";

            return Ok(ApiResponse<MultipleMediaUploadResponse>.SuccessResponse(result, message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading multiple files");
            return StatusCode(500, ApiResponse<MultipleMediaUploadResponse>.ErrorResponse("Failed to upload files"));
        }
    }

    /// <summary>
    /// Get file details by ID
    /// </summary>
    [HttpGet("{fileId}")]
    [Authorize(Policy = "VendorOrAdmin")]
    public async Task<ActionResult<ApiResponse<MediaFileDetailsResponse>>> GetFileDetails(Guid fileId)
    {
        try
        {
            var file = await _mediaService.GetFileDetailsAsync(fileId);
            
            if (file == null)
            {
                return NotFound(ApiResponse<MediaFileDetailsResponse>.ErrorResponse("File not found"));
            }

            return Ok(ApiResponse<MediaFileDetailsResponse>.SuccessResponse(file));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching file details: {FileId}", fileId);
            return StatusCode(500, ApiResponse<MediaFileDetailsResponse>.ErrorResponse("Failed to fetch file details"));
        }
    }

    /// <summary>
    /// Get files uploaded by a user
    /// </summary>
    [HttpGet("user/{userId}")]
    [Authorize(Policy = "VendorOrAdmin")]
    public async Task<ActionResult<ApiResponse<List<MediaFileDetailsResponse>>>> GetFilesByUser(
        string userId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        try
        {
            var files = await _mediaService.GetFilesByUserAsync(userId, page, pageSize);
            return Ok(ApiResponse<List<MediaFileDetailsResponse>>.SuccessResponse(files));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching files by user: {UserId}", userId);
            return StatusCode(500, ApiResponse<List<MediaFileDetailsResponse>>.ErrorResponse("Failed to fetch files"));
        }
    }

    /// <summary>
    /// Get files related to an entity (vendor, product, order, etc.)
    /// </summary>
    [HttpGet("entity/{entityType}/{entityId}")]
    [Authorize(Policy = "VendorOrAdmin")]
    public async Task<ActionResult<ApiResponse<List<MediaFileDetailsResponse>>>> GetFilesByEntity(
        string entityType,
        string entityId)
    {
        try
        {
            var files = await _mediaService.GetFilesByEntityAsync(entityType, entityId);
            return Ok(ApiResponse<List<MediaFileDetailsResponse>>.SuccessResponse(files));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching files by entity: {EntityType}/{EntityId}", entityType, entityId);
            return StatusCode(500, ApiResponse<List<MediaFileDetailsResponse>>.ErrorResponse("Failed to fetch files"));
        }
    }

    /// <summary>
    /// Delete a file (soft delete)
    /// </summary>
    [HttpDelete("{fileId}")]
    [Authorize(Policy = "VendorOrAdmin")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteFile(Guid fileId)
    {
        try
        {
            var success = await _mediaService.DeleteFileAsync(fileId);
            
            if (!success)
            {
                return NotFound(ApiResponse<bool>.ErrorResponse("File not found"));
            }

            return Ok(ApiResponse<bool>.SuccessResponse(true, "File deleted successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting file: {FileId}", fileId);
            return StatusCode(500, ApiResponse<bool>.ErrorResponse("Failed to delete file"));
        }
    }

    /// <summary>
    /// Generate a presigned URL for private file access
    /// </summary>
    [HttpPost("presigned-url")]
    [Authorize(Policy = "VendorOrAdmin")]
    public async Task<ActionResult<ApiResponse<string>>> GeneratePresignedUrl(
        [FromBody] string s3Key,
        [FromQuery] int expirationMinutes = 60)
    {
        try
        {
            var url = await _mediaService.GeneratePresignedUrlAsync(s3Key, expirationMinutes);
            return Ok(ApiResponse<string>.SuccessResponse(url, "Presigned URL generated"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating presigned URL");
            return StatusCode(500, ApiResponse<string>.ErrorResponse("Failed to generate URL"));
        }
    }
}
