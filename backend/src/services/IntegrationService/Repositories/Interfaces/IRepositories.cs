using IntegrationService.Models.Entities;

namespace IntegrationService.Repositories.Interfaces;

public interface IWhatsAppMessageRepository
{
    Task<WhatsAppMessage> CreateAsync(WhatsAppMessage message);
    Task<WhatsAppMessage?> GetByIdAsync(Guid id);
    Task<WhatsAppMessage?> GetByWhatsAppMessageIdAsync(string whatsappMessageId);
    Task<List<WhatsAppMessage>> GetByPhoneNumberAsync(string phoneNumber, int page = 1, int pageSize = 50);
    Task<List<WhatsAppMessage>> GetByUserIdAsync(string userId, int page = 1, int pageSize = 50);
    Task<List<WhatsAppMessage>> GetPendingMessagesAsync(int limit = 100);
    Task UpdateAsync(WhatsAppMessage message);
    Task UpdateStatusAsync(Guid id, string status, string? errorMessage = null);
    Task<int> GetTotalCountByPhoneNumberAsync(string phoneNumber);
    Task<int> GetTotalCountByUserIdAsync(string userId);
}

public interface IMediaFileRepository
{
    Task<MediaFile> CreateAsync(MediaFile file);
    Task<MediaFile?> GetByIdAsync(Guid id);
    Task<MediaFile?> GetByS3KeyAsync(string s3Key);
    Task<List<MediaFile>> GetByUserIdAsync(string userId, int page = 1, int pageSize = 50);
    Task<List<MediaFile>> GetByEntityAsync(string entityType, string entityId);
    Task UpdateAsync(MediaFile file);
    Task SoftDeleteAsync(Guid id);
    Task<int> GetTotalCountByUserIdAsync(string userId);
}

public interface ILocationCacheRepository
{
    Task<LocationCache> CreateAsync(LocationCache location);
    Task<LocationCache?> GetByAddressAsync(string address);
    Task<LocationCache?> GetByPlaceIdAsync(string placeId);
    Task<LocationCache?> GetByCoordinatesAsync(double latitude, double longitude, double toleranceKm = 0.1);
    Task UpdateHitCountAsync(Guid id);
    Task CleanupExpiredCacheAsync();
}
