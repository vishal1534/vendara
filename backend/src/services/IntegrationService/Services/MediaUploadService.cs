using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Http;
using IntegrationService.Models.Entities;
using IntegrationService.Models.Requests;
using IntegrationService.Models.Responses;
using IntegrationService.Repositories.Interfaces;
using IntegrationService.Services.Interfaces;

namespace IntegrationService.Services;

public class MediaUploadService : IMediaUploadService
{
    private readonly IAmazonS3 _s3Client;
    private readonly IMediaFileRepository _fileRepository;
    private readonly IConfiguration _configuration;
    private readonly ILogger<MediaUploadService> _logger;

    private readonly string _bucketName;
    private readonly string _mediaUrlPrefix;

    // Allowed file types
    private readonly Dictionary<string, List<string>> _allowedFileTypes = new()
    {
        ["image"] = new List<string> { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg" },
        ["document"] = new List<string> { ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt" },
        ["video"] = new List<string> { ".mp4", ".mov", ".avi", ".mkv" },
        ["audio"] = new List<string> { ".mp3", ".wav", ".ogg", ".m4a" }
    };

    // Max file sizes (in bytes)
    private readonly Dictionary<string, long> _maxFileSizes = new()
    {
        ["image"] = 10 * 1024 * 1024,      // 10 MB
        ["document"] = 20 * 1024 * 1024,   // 20 MB
        ["video"] = 100 * 1024 * 1024,     // 100 MB
        ["audio"] = 20 * 1024 * 1024       // 20 MB
    };

    public MediaUploadService(
        IAmazonS3 s3Client,
        IMediaFileRepository fileRepository,
        IConfiguration configuration,
        ILogger<MediaUploadService> logger)
    {
        _s3Client = s3Client;
        _fileRepository = fileRepository;
        _configuration = configuration;
        _logger = logger;

        _bucketName = configuration["AWS:S3:BucketName"] ?? throw new InvalidOperationException("S3 BucketName not configured");
        _mediaUrlPrefix = configuration["AWS:S3:MediaUrlPrefix"] ?? $"https://{_bucketName}.s3.amazonaws.com/";
    }

    public async Task<MediaUploadResponse> UploadFileAsync(IFormFile file, UploadMediaRequest request)
    {
        try
        {
            // Validate file
            ValidateFile(file);

            // Determine category
            var category = DetermineFileCategory(file.FileName);

            // Validate file size
            if (!ValidateFileSize(file.Length, category))
            {
                throw new InvalidOperationException($"File size exceeds maximum allowed for {category} files");
            }

            // Generate unique filename
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            var storageFilename = $"{Guid.NewGuid()}{extension}";
            
            // Build S3 key (path in bucket)
            var s3Key = BuildS3Key(category, request.UploadContext, storageFilename);

            // Upload to S3
            using var stream = file.OpenReadStream();
            var uploadRequest = new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = s3Key,
                InputStream = stream,
                ContentType = file.ContentType,
                CannedACL = request.IsPublic ? S3CannedACL.PublicRead : S3CannedACL.Private
            };

            // Add metadata
            uploadRequest.Metadata.Add("original-filename", file.FileName);
            if (!string.IsNullOrEmpty(request.UploadedByUserId))
            {
                uploadRequest.Metadata.Add("uploaded-by", request.UploadedByUserId);
            }

            var uploadResponse = await _s3Client.PutObjectAsync(uploadRequest);

            if (uploadResponse.HttpStatusCode == System.Net.HttpStatusCode.OK)
            {
                // Build public URL
                var url = $"{_mediaUrlPrefix}{s3Key}";

                // Save to database
                var mediaFile = new MediaFile
                {
                    OriginalFilename = file.FileName,
                    StorageFilename = storageFilename,
                    BucketName = _bucketName,
                    S3Key = s3Key,
                    Url = url,
                    MimeType = file.ContentType,
                    FileSize = file.Length,
                    Category = category,
                    UploadContext = request.UploadContext,
                    UploadedByUserId = request.UploadedByUserId,
                    UploadedByUserType = request.UploadedByUserType,
                    RelatedEntityId = request.RelatedEntityId,
                    RelatedEntityType = request.RelatedEntityType,
                    IsPublic = request.IsPublic
                };

                await _fileRepository.CreateAsync(mediaFile);

                _logger.LogInformation("File uploaded successfully: {Filename} -> {S3Key}", file.FileName, s3Key);

                return new MediaUploadResponse
                {
                    FileId = mediaFile.Id,
                    OriginalFilename = mediaFile.OriginalFilename,
                    Url = mediaFile.Url,
                    MimeType = mediaFile.MimeType,
                    FileSize = mediaFile.FileSize,
                    Category = mediaFile.Category,
                    UploadedAt = mediaFile.CreatedAt
                };
            }
            else
            {
                throw new Exception($"S3 upload failed with status code: {uploadResponse.HttpStatusCode}");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading file: {Filename}", file.FileName);
            throw;
        }
    }

    public async Task<MultipleMediaUploadResponse> UploadMultipleFilesAsync(List<IFormFile> files, UploadMultipleMediaRequest request)
    {
        var response = new MultipleMediaUploadResponse();
        var errors = new List<string>();

        foreach (var file in files)
        {
            try
            {
                var uploadRequest = new UploadMediaRequest
                {
                    File = file,
                    UploadContext = request.UploadContext,
                    UploadedByUserId = request.UploadedByUserId,
                    UploadedByUserType = request.UploadedByUserType,
                    RelatedEntityId = request.RelatedEntityId,
                    RelatedEntityType = request.RelatedEntityType,
                    IsPublic = request.IsPublic
                };

                var result = await UploadFileAsync(file, uploadRequest);
                response.Files.Add(result);
                response.SuccessCount++;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading file in batch: {Filename}", file.FileName);
                errors.Add($"{file.FileName}: {ex.Message}");
                response.FailureCount++;
            }
        }

        response.Errors = errors.Any() ? errors : null;

        return response;
    }

    public async Task<MediaFileDetailsResponse?> GetFileDetailsAsync(Guid fileId)
    {
        var file = await _fileRepository.GetByIdAsync(fileId);
        return file != null ? MapToDetailsResponse(file) : null;
    }

    public async Task<List<MediaFileDetailsResponse>> GetFilesByUserAsync(string userId, int page = 1, int pageSize = 50)
    {
        var files = await _fileRepository.GetByUserIdAsync(userId, page, pageSize);
        return files.Select(MapToDetailsResponse).ToList();
    }

    public async Task<List<MediaFileDetailsResponse>> GetFilesByEntityAsync(string entityType, string entityId)
    {
        var files = await _fileRepository.GetByEntityAsync(entityType, entityId);
        return files.Select(MapToDetailsResponse).ToList();
    }

    public async Task<bool> DeleteFileAsync(Guid fileId)
    {
        try
        {
            var file = await _fileRepository.GetByIdAsync(fileId);
            if (file == null)
                return false;

            // Delete from S3
            var deleteRequest = new DeleteObjectRequest
            {
                BucketName = _bucketName,
                Key = file.S3Key
            };

            await _s3Client.DeleteObjectAsync(deleteRequest);

            // Soft delete from database
            await _fileRepository.SoftDeleteAsync(fileId);

            _logger.LogInformation("File deleted successfully: {FileId}", fileId);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting file: {FileId}", fileId);
            throw;
        }
    }

    public async Task<string> GeneratePresignedUrlAsync(string s3Key, int expirationMinutes = 60)
    {
        try
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = s3Key,
                Expires = DateTime.UtcNow.AddMinutes(expirationMinutes)
            };

            return await Task.FromResult(_s3Client.GetPreSignedURL(request));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating presigned URL for: {S3Key}", s3Key);
            throw;
        }
    }

    // ========================================================================
    // HELPER METHODS
    // ========================================================================

    private void ValidateFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("File is empty");

        if (string.IsNullOrEmpty(file.FileName))
            throw new ArgumentException("Filename is required");

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (string.IsNullOrEmpty(extension))
            throw new ArgumentException("File must have an extension");

        // Check if extension is allowed
        var isAllowed = _allowedFileTypes.Values.Any(extensions => extensions.Contains(extension));
        if (!isAllowed)
            throw new ArgumentException($"File type {extension} is not allowed");
    }

    private bool ValidateFileSize(long fileSize, string category)
    {
        if (_maxFileSizes.TryGetValue(category, out var maxSize))
        {
            return fileSize <= maxSize;
        }
        return fileSize <= 20 * 1024 * 1024; // Default 20MB
    }

    private string DetermineFileCategory(string filename)
    {
        var extension = Path.GetExtension(filename).ToLowerInvariant();

        foreach (var (category, extensions) in _allowedFileTypes)
        {
            if (extensions.Contains(extension))
                return category;
        }

        return "document"; // Default category
    }

    private string BuildS3Key(string category, string? uploadContext, string storageFilename)
    {
        // Structure: category/context/year/month/filename
        var year = DateTime.UtcNow.Year;
        var month = DateTime.UtcNow.Month.ToString("D2");

        var context = string.IsNullOrEmpty(uploadContext) ? "general" : uploadContext;

        return $"{category}/{context}/{year}/{month}/{storageFilename}";
    }

    private static MediaFileDetailsResponse MapToDetailsResponse(MediaFile file)
    {
        return new MediaFileDetailsResponse
        {
            FileId = file.Id,
            OriginalFilename = file.OriginalFilename,
            StorageFilename = file.StorageFilename,
            Url = file.Url,
            MimeType = file.MimeType,
            FileSize = file.FileSize,
            Category = file.Category,
            UploadContext = file.UploadContext,
            UploadedByUserId = file.UploadedByUserId,
            UploadedByUserType = file.UploadedByUserType,
            RelatedEntityId = file.RelatedEntityId,
            RelatedEntityType = file.RelatedEntityType,
            IsPublic = file.IsPublic,
            CreatedAt = file.CreatedAt
        };
    }
}
