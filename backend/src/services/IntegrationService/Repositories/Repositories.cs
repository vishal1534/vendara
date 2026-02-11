using Microsoft.EntityFrameworkCore;
using IntegrationService.Data;
using IntegrationService.Models.Entities;
using IntegrationService.Repositories.Interfaces;

namespace IntegrationService.Repositories;

public class WhatsAppMessageRepository : IWhatsAppMessageRepository
{
    private readonly IntegrationDbContext _context;

    public WhatsAppMessageRepository(IntegrationDbContext context)
    {
        _context = context;
    }

    public async Task<WhatsAppMessage> CreateAsync(WhatsAppMessage message)
    {
        _context.WhatsAppMessages.Add(message);
        await _context.SaveChangesAsync();
        return message;
    }

    public async Task<WhatsAppMessage?> GetByIdAsync(Guid id)
    {
        return await _context.WhatsAppMessages.FindAsync(id);
    }

    public async Task<WhatsAppMessage?> GetByWhatsAppMessageIdAsync(string whatsappMessageId)
    {
        return await _context.WhatsAppMessages
            .FirstOrDefaultAsync(m => m.WhatsAppMessageId == whatsappMessageId);
    }

    public async Task<List<WhatsAppMessage>> GetByPhoneNumberAsync(string phoneNumber, int page = 1, int pageSize = 50)
    {
        return await _context.WhatsAppMessages
            .Where(m => m.PhoneNumber == phoneNumber)
            .OrderByDescending(m => m.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<List<WhatsAppMessage>> GetByUserIdAsync(string userId, int page = 1, int pageSize = 50)
    {
        return await _context.WhatsAppMessages
            .Where(m => m.UserId == userId)
            .OrderByDescending(m => m.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<List<WhatsAppMessage>> GetPendingMessagesAsync(int limit = 100)
    {
        return await _context.WhatsAppMessages
            .Where(m => m.Status == "sent" || m.Status == "pending")
            .OrderBy(m => m.CreatedAt)
            .Take(limit)
            .ToListAsync();
    }

    public async Task UpdateAsync(WhatsAppMessage message)
    {
        message.UpdatedAt = DateTime.UtcNow;
        _context.WhatsAppMessages.Update(message);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateStatusAsync(Guid id, string status, string? errorMessage = null)
    {
        var message = await GetByIdAsync(id);
        if (message != null)
        {
            message.Status = status;
            message.ErrorMessage = errorMessage;
            message.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<int> GetTotalCountByPhoneNumberAsync(string phoneNumber)
    {
        return await _context.WhatsAppMessages
            .CountAsync(m => m.PhoneNumber == phoneNumber);
    }

    public async Task<int> GetTotalCountByUserIdAsync(string userId)
    {
        return await _context.WhatsAppMessages
            .CountAsync(m => m.UserId == userId);
    }
}

public class MediaFileRepository : IMediaFileRepository
{
    private readonly IntegrationDbContext _context;

    public MediaFileRepository(IntegrationDbContext context)
    {
        _context = context;
    }

    public async Task<MediaFile> CreateAsync(MediaFile file)
    {
        _context.MediaFiles.Add(file);
        await _context.SaveChangesAsync();
        return file;
    }

    public async Task<MediaFile?> GetByIdAsync(Guid id)
    {
        return await _context.MediaFiles.FindAsync(id);
    }

    public async Task<MediaFile?> GetByS3KeyAsync(string s3Key)
    {
        return await _context.MediaFiles
            .FirstOrDefaultAsync(f => f.S3Key == s3Key);
    }

    public async Task<List<MediaFile>> GetByUserIdAsync(string userId, int page = 1, int pageSize = 50)
    {
        return await _context.MediaFiles
            .Where(f => f.UploadedByUserId == userId)
            .OrderByDescending(f => f.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<List<MediaFile>> GetByEntityAsync(string entityType, string entityId)
    {
        return await _context.MediaFiles
            .Where(f => f.RelatedEntityType == entityType && f.RelatedEntityId == entityId)
            .OrderByDescending(f => f.CreatedAt)
            .ToListAsync();
    }

    public async Task UpdateAsync(MediaFile file)
    {
        file.UpdatedAt = DateTime.UtcNow;
        _context.MediaFiles.Update(file);
        await _context.SaveChangesAsync();
    }

    public async Task SoftDeleteAsync(Guid id)
    {
        var file = await GetByIdAsync(id);
        if (file != null)
        {
            file.DeletedAt = DateTime.UtcNow;
            file.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<int> GetTotalCountByUserIdAsync(string userId)
    {
        return await _context.MediaFiles
            .CountAsync(f => f.UploadedByUserId == userId);
    }
}

public class LocationCacheRepository : ILocationCacheRepository
{
    private readonly IntegrationDbContext _context;

    public LocationCacheRepository(IntegrationDbContext context)
    {
        _context = context;
    }

    public async Task<LocationCache> CreateAsync(LocationCache location)
    {
        _context.LocationCache.Add(location);
        await _context.SaveChangesAsync();
        return location;
    }

    public async Task<LocationCache?> GetByAddressAsync(string address)
    {
        var normalized = address.Trim().ToLowerInvariant();
        return await _context.LocationCache
            .FirstOrDefaultAsync(l => l.NormalizedAddress == normalized);
    }

    public async Task<LocationCache?> GetByPlaceIdAsync(string placeId)
    {
        return await _context.LocationCache
            .FirstOrDefaultAsync(l => l.PlaceId == placeId);
    }

    public async Task<LocationCache?> GetByCoordinatesAsync(double latitude, double longitude, double toleranceKm = 0.1)
    {
        // Convert tolerance to degrees (approximately)
        var latTolerance = toleranceKm / 111.0; // 1 degree latitude ≈ 111 km
        var lonTolerance = toleranceKm / (111.0 * Math.Cos(latitude * Math.PI / 180.0));

        return await _context.LocationCache
            .FirstOrDefaultAsync(l =>
                Math.Abs(l.Latitude - latitude) < latTolerance &&
                Math.Abs(l.Longitude - longitude) < lonTolerance);
    }

    public async Task UpdateHitCountAsync(Guid id)
    {
        var cache = await _context.LocationCache.FindAsync(id);
        if (cache != null)
        {
            cache.HitCount++;
            cache.LastAccessedAt = DateTime.UtcNow;
            cache.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    public async Task CleanupExpiredCacheAsync()
    {
        var expired = await _context.LocationCache
            .IgnoreQueryFilters()
            .Where(l => l.ExpiresAt <= DateTime.UtcNow)
            .ToListAsync();

        _context.LocationCache.RemoveRange(expired);
        await _context.SaveChangesAsync();
    }
}
