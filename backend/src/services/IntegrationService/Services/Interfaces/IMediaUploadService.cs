using Microsoft.AspNetCore.Http;
using IntegrationService.Models.Requests;
using IntegrationService.Models.Responses;

namespace IntegrationService.Services.Interfaces;

public interface IMediaUploadService
{
    Task<MediaUploadResponse> UploadFileAsync(IFormFile file, UploadMediaRequest request);
    Task<MultipleMediaUploadResponse> UploadMultipleFilesAsync(List<IFormFile> files, UploadMultipleMediaRequest request);
    Task<MediaFileDetailsResponse?> GetFileDetailsAsync(Guid fileId);
    Task<List<MediaFileDetailsResponse>> GetFilesByUserAsync(string userId, int page = 1, int pageSize = 50);
    Task<List<MediaFileDetailsResponse>> GetFilesByEntityAsync(string entityType, string entityId);
    Task<bool> DeleteFileAsync(Guid fileId);
    Task<string> GeneratePresignedUrlAsync(string s3Key, int expirationMinutes = 60);
}
